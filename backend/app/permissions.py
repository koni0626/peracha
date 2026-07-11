from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import RoomMember


def ensure_room_member(db: Session, room_id: str, user_id: str) -> RoomMember:
    member = db.scalar(select(RoomMember).where(RoomMember.room_id == room_id, RoomMember.user_id == user_id))
    if not member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Room access denied")
    return member


def ensure_room_admin(db: Session, room_id: str, user_id: str) -> RoomMember:
    member = ensure_room_member(db, room_id, user_id)
    if member.role not in {"owner", "admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Room admin role required")
    return member


def count_room_owners(db: Session, room_id: str) -> int:
    return len(db.scalars(select(RoomMember.id).where(RoomMember.room_id == room_id, RoomMember.role == "owner")).all())


def ensure_room_owner_action(actor: RoomMember, target: RoomMember, next_role: str | None = None) -> None:
    touches_owner = target.role == "owner" or next_role == "owner"
    if touches_owner and actor.role != "owner":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Room owner role required")
