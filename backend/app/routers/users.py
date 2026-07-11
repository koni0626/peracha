import os

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..config import settings
from ..models import RoomMember, User
from ..permissions import ensure_room_admin
from ..room_serializers import user_out
from ..room_schemas import UserOut
from ..schemas import PageOut
from ..security import get_current_user


router = APIRouter(prefix="/api/users", tags=["users"])


AVATAR_EXTENSIONS = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
}
MAX_AVATAR_BYTES = 8 * 1024 * 1024


def avatar_dir() -> str:
    path = os.path.join(settings.upload_dir, "avatars")
    os.makedirs(path, exist_ok=True)
    return path


def avatar_path(user_id: str) -> tuple[str, str] | None:
    for content_type, extension in AVATAR_EXTENSIONS.items():
        path = os.path.join(settings.upload_dir, "avatars", f"{user_id}.{extension}")
        if os.path.exists(path):
            return path, content_type
    return None


@router.post("/me/avatar", response_model=UserOut)
def upload_my_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> UserOut:
    content_type = (file.content_type or "").lower()
    extension = AVATAR_EXTENSIONS.get(content_type)
    if not extension:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported avatar image type")
    directory = avatar_dir()
    destination = os.path.join(directory, f"{current_user.id}.{extension}")
    temp_destination = f"{destination}.tmp"
    size = 0
    try:
        with open(temp_destination, "wb") as output:
            while chunk := file.file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_AVATAR_BYTES:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="Avatar image is too large",
                    )
                output.write(chunk)
        for old_extension in AVATAR_EXTENSIONS.values():
            old_path = os.path.join(directory, f"{current_user.id}.{old_extension}")
            if os.path.exists(old_path):
                os.remove(old_path)
        os.replace(temp_destination, destination)
    except Exception:
        if os.path.exists(temp_destination):
            os.remove(temp_destination)
        raise
    return user_out(current_user)


@router.get("/{user_id}/avatar")
def get_user_avatar(
    user_id: str,
    current_user: User = Depends(get_current_user),
) -> FileResponse:
    found = avatar_path(user_id)
    if not found:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Avatar not found")
    path, content_type = found
    return FileResponse(path, media_type=content_type, filename=os.path.basename(path), content_disposition_type="inline")


@router.get("/search", response_model=PageOut[UserOut])
def search_users(
    q: str = Query(default="", max_length=120),
    exclude_room_id: str | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=30),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[UserOut]:
    if exclude_room_id:
        ensure_room_admin(db, exclude_room_id, current_user.id)

    stmt = select(User).where(User.status == "active")
    query = q.strip()
    if query:
        pattern = f"%{query.lower()}%"
        stmt = stmt.where(or_(User.name.ilike(pattern), User.email.ilike(pattern)))
    if exclude_room_id:
        member_user_ids = select(RoomMember.user_id).where(RoomMember.room_id == exclude_room_id)
        stmt = stmt.where(User.id.not_in(member_user_ids))

    users = db.scalars(stmt.order_by(User.name, User.email).limit(limit)).all()
    return PageOut[UserOut](items=[user_out(user) for user in users])
