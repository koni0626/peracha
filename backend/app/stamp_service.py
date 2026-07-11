import base64
from urllib.parse import urlparse

from fastapi import HTTPException, UploadFile, status
from fastapi.responses import RedirectResponse, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Stamp


STAMP_UPLOAD_CONTENT_TYPES = {"image/png", "image/jpeg", "image/webp", "image/gif"}
MAX_STAMP_UPLOAD_BYTES = 8 * 1024 * 1024


def shorten_stamp_text(text: str, limit: int = 24) -> str:
    return text if len(text) <= limit else f"{text[:limit].rstrip()}..."


def upload_stamp_title(filename: str | None, title: str | None) -> str:
    requested_title = (title or "").strip()
    raw_filename = (filename or "").replace("\\", "/").rsplit("/", 1)[-1].strip()
    return shorten_stamp_text(requested_title or raw_filename or "アップロードスタンプ", 40)


async def read_stamp_upload(file: UploadFile) -> tuple[str, bytes]:
    content_type = (file.content_type or "").split(";", 1)[0].lower()
    if content_type not in STAMP_UPLOAD_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="スタンプ画像はPNG、JPEG、WebP、GIFのいずれかを指定してください。",
        )

    chunks = bytearray()
    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        chunks.extend(chunk)
        if len(chunks) > MAX_STAMP_UPLOAD_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="スタンプ画像は8MB以下にしてください。",
            )
    if not chunks:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="スタンプ画像が空です。")
    return content_type, bytes(chunks)


def get_user_stamp_or_404(db: Session, stamp_id: str, user_id: str) -> Stamp:
    stamp = db.scalar(select(Stamp).where(Stamp.id == stamp_id, Stamp.user_id == user_id))
    if not stamp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stamp not found")
    return stamp


def stamp_image_response(stamp: Stamp) -> Response:
    if stamp.image_url.startswith("data:"):
        header, _, encoded = stamp.image_url.partition(",")
        if ";base64" not in header or not encoded:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stamp image is invalid")
        media_type = header.removeprefix("data:").split(";", 1)[0] or "image/png"
        return Response(content=base64.b64decode(encoded), media_type=media_type)

    parsed = urlparse(stamp.image_url)
    if parsed.scheme in {"http", "https"}:
        return RedirectResponse(stamp.image_url)

    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stamp image is invalid")


def create_uploaded_stamp(
    db: Session,
    user_id: str,
    folder_id: str | None,
    filename: str | None,
    title: str | None,
    content_type: str,
    image_bytes: bytes,
) -> Stamp:
    encoded = base64.b64encode(image_bytes).decode("ascii")
    display_title = upload_stamp_title(filename, title)
    stamp = Stamp(
        user_id=user_id,
        folder_id=folder_id,
        title=display_title,
        prompt=f"アップロードスタンプ: {display_title}",
        image_url=f"data:{content_type};base64,{encoded}",
        image_model="upload",
        reference_used="false",
    )
    db.add(stamp)
    return stamp
