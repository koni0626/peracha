import base64
import html
import os
import re
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..ai_image_client import generate_peraichi_image_with_openai
from ..config import settings
from ..database import get_db
from ..diagnosis_service import create_clarity_record, create_proofreading_record
from ..file_storage import room_file_out
from ..models import Room, RoomFile, User
from ..permissions import ensure_room_member
from ..assist_schemas import MessageRewriteIn, MessageRewriteOut, PeraichiCreateIn, PeraichiCreateOut
from ..security import get_current_user


router = APIRouter(prefix="/api/rooms/{room_id}/assist", tags=["assist"])


def _safe_filename_part(value: str) -> str:
    cleaned = re.sub(r"[^\w\-一-龥ぁ-んァ-ンー]+", "_", value, flags=re.UNICODE).strip("_")
    return cleaned[:48] or "peraichi"


def _shorten(value: str, limit: int = 64) -> str:
    return value if len(value) <= limit else f"{value[:limit].rstrip()}..."


def _fallback_peraichi_svg(room_name: str, title: str, text: str) -> bytes:
    lines = [line.strip("-* 　\t") for line in text.splitlines() if line.strip()]
    if not lines:
        lines = [text.strip()]
    escaped_title = html.escape(title or f"{room_name} のペライチ")
    rows = [
        "<svg xmlns='http://www.w3.org/2000/svg' width='1536' height='1024' viewBox='0 0 1536 1024'>",
        "<rect width='1536' height='1024' fill='#f4f8f9'/>",
        "<rect x='72' y='64' width='1392' height='896' rx='24' fill='#ffffff' stroke='#d6e2e5'/>",
        "<text x='116' y='132' font-size='28' font-family='Arial, sans-serif' font-weight='700' fill='#0f7775'>PERAICHI CHAT</text>",
        f"<text x='116' y='196' font-size='48' font-family='Arial, sans-serif' font-weight='800' fill='#17282f'>{escaped_title}</text>",
        f"<text x='116' y='246' font-size='24' font-family='Arial, sans-serif' fill='#60747c'>{html.escape(room_name)}</text>",
    ]
    y = 326
    for index, line in enumerate(lines[:12], start=1):
        rows.append(f"<circle cx='128' cy='{y - 8}' r='9' fill='#0f8f8c'/>")
        rows.append(
            f"<text x='154' y='{y}' font-size='28' font-family='Arial, sans-serif' fill='#17282f'>"
            f"{html.escape(_shorten(line, 58))}</text>"
        )
        y += 56 if index < 4 else 48
    rows.append("<text x='116' y='914' font-size='22' font-family='Arial, sans-serif' fill='#60747c'>Powered by BLAS / ペラチャ</text>")
    rows.append("</svg>")
    return "".join(rows).encode("utf-8")


def _data_url_to_file(data_url: str) -> tuple[bytes, str, str] | None:
    match = re.match(r"^data:(?P<mime>[-\w.+/]+);base64,(?P<data>.+)$", data_url, flags=re.DOTALL)
    if not match:
        return None
    content_type = match.group("mime")
    extension = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/svg+xml": "svg",
        "image/webp": "webp",
    }.get(content_type, "png")
    return base64.b64decode(match.group("data")), content_type, extension


def _store_peraichi_file(
    db: Session,
    room_id: str,
    user_id: str,
    title: str,
    content: bytes,
    content_type: str,
    extension: str,
) -> RoomFile:
    original_name = f"{_safe_filename_part(title)}.{extension}"
    stored_name = f"{secrets.token_hex(16)}_{original_name}"
    room_dir = os.path.join(settings.upload_dir, room_id)
    os.makedirs(room_dir, exist_ok=True)
    with open(os.path.join(room_dir, stored_name), "wb") as output:
        output.write(content)
    record = RoomFile(
        room_id=room_id,
        uploaded_by_user_id=user_id,
        original_name=original_name,
        stored_name=stored_name,
        content_type=content_type,
        size_bytes=len(content),
    )
    db.add(record)
    db.flush()
    return record


@router.post("/rewrite", response_model=MessageRewriteOut)
def rewrite_message(
    room_id: str,
    payload: MessageRewriteIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageRewriteOut:
    ensure_room_member(db, room_id, current_user.id)
    diagnosis = create_proofreading_record(
        db,
        text=payload.text,
        room_id=room_id,
        user_id=current_user.id,
        room_message_id=None,
        source="composer_ai",
    )
    db.commit()
    db.refresh(diagnosis)
    return MessageRewriteOut(
        original_text=diagnosis.original_text,
        improved_text=diagnosis.improved_text,
        diagnosis_id=diagnosis.id,
    )


@router.post("/clarify", response_model=MessageRewriteOut)
def clarify_message(
    room_id: str,
    payload: MessageRewriteIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageRewriteOut:
    ensure_room_member(db, room_id, current_user.id)
    diagnosis = create_clarity_record(
        db,
        text=payload.text,
        room_id=room_id,
        user_id=current_user.id,
        room_message_id=None,
        source="composer_clarity",
    )
    db.commit()
    db.refresh(diagnosis)
    return MessageRewriteOut(
        original_text=diagnosis.original_text,
        improved_text=diagnosis.improved_text,
        diagnosis_id=diagnosis.id,
    )


@router.post("/peraichi", response_model=PeraichiCreateOut)
def create_peraichi_image(
    room_id: str,
    payload: PeraichiCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PeraichiCreateOut:
    ensure_room_member(db, room_id, current_user.id)
    room = db.scalar(select(Room).where(Room.id == room_id))
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")

    title = payload.title or f"{room.name} のペライチ"
    image_model = payload.image_model or settings.openai_image_model
    image_data = generate_peraichi_image_with_openai(room.name, payload.text, image_model)
    parsed = _data_url_to_file(image_data) if image_data else None
    if parsed:
        content, content_type, extension = parsed
    else:
        content = _fallback_peraichi_svg(room.name, title, payload.text)
        content_type = "image/svg+xml"
        extension = "svg"

    record = _store_peraichi_file(db, room_id, current_user.id, title, content, content_type, extension)
    db.commit()
    db.refresh(record)
    return PeraichiCreateOut(title=title, file=room_file_out(record))
