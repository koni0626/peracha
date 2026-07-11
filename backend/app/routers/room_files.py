import os
import secrets

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..chat_schemas import RoomFileOut, RoomFilePreviewOut
from ..config import settings
from ..database import get_db
from ..file_storage import extract_file_preview, file_preview_kind, room_file_out, room_file_path
from ..models import RoomFile, User
from ..permissions import ensure_room_member
from ..schemas import PageOut
from ..security import get_current_user


router = APIRouter(prefix="/api/rooms/{room_id}/files", tags=["room-files"])


@router.get("", response_model=PageOut[RoomFileOut])
def list_room_files(
    room_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[RoomFileOut]:
    ensure_room_member(db, room_id, current_user.id)
    files = db.scalars(select(RoomFile).where(RoomFile.room_id == room_id).order_by(desc(RoomFile.created_at))).all()
    return PageOut[RoomFileOut](items=[room_file_out(file) for file in files])


@router.post("", response_model=RoomFileOut)
def upload_room_file(
    room_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RoomFileOut:
    ensure_room_member(db, room_id, current_user.id)
    original_name = os.path.basename(file.filename or "attachment")
    stored_name = f"{secrets.token_hex(16)}_{original_name}"
    room_dir = os.path.join(settings.upload_dir, room_id)
    os.makedirs(room_dir, exist_ok=True)
    destination = os.path.join(room_dir, stored_name)
    size = 0
    with open(destination, "wb") as output:
        while chunk := file.file.read(1024 * 1024):
            size += len(chunk)
            output.write(chunk)
    record = RoomFile(
        room_id=room_id,
        uploaded_by_user_id=current_user.id,
        original_name=original_name,
        stored_name=stored_name,
        content_type=file.content_type,
        size_bytes=size,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return room_file_out(record)


@router.get("/{file_id}/download")
def download_room_file(
    room_id: str,
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FileResponse:
    ensure_room_member(db, room_id, current_user.id)
    record = db.scalar(select(RoomFile).where(RoomFile.id == file_id, RoomFile.room_id == room_id))
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    path = room_file_path(record)
    if not os.path.exists(path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File content not found")
    disposition = "inline" if file_preview_kind(record) in {"pdf", "image", "video"} else "attachment"
    return FileResponse(
        path,
        media_type=record.content_type or "application/octet-stream",
        filename=record.original_name,
        content_disposition_type=disposition,
    )


@router.get("/{file_id}/preview", response_model=RoomFilePreviewOut)
def preview_room_file(
    room_id: str,
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RoomFilePreviewOut:
    ensure_room_member(db, room_id, current_user.id)
    record = db.scalar(select(RoomFile).where(RoomFile.id == file_id, RoomFile.room_id == room_id))
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
    path = room_file_path(record)
    if not os.path.exists(path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File content not found")
    preview_kind = file_preview_kind(record)
    if preview_kind not in {"docx", "xlsx", "pptx"}:
        return RoomFilePreviewOut(file_id=record.id, preview_kind=preview_kind, text="", truncated=False)
    text, truncated = extract_file_preview(path, preview_kind)
    return RoomFilePreviewOut(file_id=record.id, preview_kind=preview_kind, text=text, truncated=truncated)
