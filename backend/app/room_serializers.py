import os

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from .config import settings
from .models import Room, RoomInvitation, RoomMember, RoomMessage, RoomReadState, User
from .room_schemas import InvitationOut, RoomMemberOut, RoomOut, UserOut


def user_avatar_url(user_id: str) -> str | None:
    avatar_dir = os.path.join(settings.upload_dir, "avatars")
    for extension in ("png", "jpg", "jpeg", "webp", "gif"):
        path = os.path.join(avatar_dir, f"{user_id}.{extension}")
        if os.path.exists(path):
            version = os.stat(path).st_mtime_ns
            return f"/api/users/{user_id}/avatar?v={version}"
    return None


def user_out(user: User) -> UserOut:
    return UserOut(id=user.id, name=user.name, email=user.email, avatar_url=user_avatar_url(user.id))


def room_unread_count(db: Session | None, room_id: str, user_id: str | None) -> int:
    if not db or not user_id:
        return 0
    state = db.scalar(select(RoomReadState).where(RoomReadState.room_id == room_id, RoomReadState.user_id == user_id))
    stmt = (
        select(func.count())
        .select_from(RoomMessage)
        .where(
            RoomMessage.room_id == room_id,
            RoomMessage.thread_id.is_(None),
            RoomMessage.deleted_at.is_(None),
            or_(RoomMessage.sender_user_id.is_(None), RoomMessage.sender_user_id != user_id),
        )
    )
    if state and state.last_read_at:
        stmt = stmt.where(RoomMessage.created_at > state.last_read_at)
    return int(db.scalar(stmt) or 0)


def room_out(room: Room, db: Session | None = None, viewer: User | None = None) -> RoomOut:
    return RoomOut(
        id=room.id,
        workspace_id=room.workspace_id,
        workspace_name=room.workspace.name if room.workspace else None,
        name=room.name,
        description=room.description,
        unread_count=room_unread_count(db, room.id, viewer.id if viewer else None),
        created_at=room.created_at,
    )


def room_member_out(member: RoomMember, user: User) -> RoomMemberOut:
    return RoomMemberOut(
        id=member.id,
        room_id=member.room_id,
        user=user_out(user),
        role=member.role,
        joined_at=member.joined_at,
    )


def invitation_out(
    invitation: RoomInvitation,
    token: str | None = None,
    email_sent: bool = False,
    email_error: str | None = None,
) -> InvitationOut:
    accept_url = f"{settings.frontend_origin}/?invite_token={token}" if token else None
    return InvitationOut(
        id=invitation.id,
        room_id=invitation.room_id,
        invited_email=invitation.invited_email,
        role=invitation.role,
        status=invitation.status,
        token=token,
        accept_url=accept_url,
        email_sent=email_sent,
        email_error=email_error,
        expires_at=invitation.expires_at,
        created_at=invitation.created_at,
    )
