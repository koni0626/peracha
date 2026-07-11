import os
import shutil
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from .config import settings
from .models import (
    ApiClient,
    ApiToken,
    AuditLog,
    CareIntervention,
    Diagnosis,
    NowHereBoard,
    Room,
    RoomFile,
    RoomInvitation,
    RoomMember,
    RoomMessage,
    RoomReadState,
    Task,
    User,
    WebhookEndpoint,
    WorkspaceMember,
)


def default_workspace_id_for_user(db: Session, user_id: str) -> str | None:
    return db.scalar(select(WorkspaceMember.workspace_id).where(WorkspaceMember.user_id == user_id))


def get_room_or_404(db: Session, room_id: str) -> Room:
    room = db.scalar(select(Room).where(Room.id == room_id))
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return room


def create_room_record(
    db: Session,
    current_user: User,
    workspace_id: str,
    name: str,
    description: str | None,
) -> Room:
    room = Room(
        workspace_id=workspace_id,
        name=name,
        description=description,
        created_by_user_id=current_user.id,
    )
    db.add(room)
    db.flush()
    db.add(RoomMember(room_id=room.id, user_id=current_user.id, role="owner"))
    return room


def rename_room(db: Session, room_id: str, name: str) -> Room:
    room = get_room_or_404(db, room_id)
    stripped_name = name.strip()
    if not stripped_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Room name is required")
    room.name = stripped_name
    room.updated_at = datetime.now(timezone.utc)
    return room


def delete_room_records(db: Session, room: Room) -> None:
    room_id = room.id
    room_upload_dir = os.path.join(settings.upload_dir, room_id)
    api_client_ids = db.scalars(select(ApiClient.id).where(ApiClient.room_id == room_id)).all()
    if api_client_ids:
        db.execute(delete(AuditLog).where(AuditLog.api_client_id.in_(api_client_ids)))
        db.execute(delete(ApiToken).where(ApiToken.api_client_id.in_(api_client_ids)))
    db.execute(delete(AuditLog).where(AuditLog.room_id == room_id))
    db.execute(delete(WebhookEndpoint).where(WebhookEndpoint.room_id == room_id))
    db.execute(delete(ApiClient).where(ApiClient.room_id == room_id))
    db.execute(delete(Task).where(Task.room_id == room_id))
    db.execute(delete(NowHereBoard).where(NowHereBoard.room_id == room_id))
    db.execute(delete(CareIntervention).where(CareIntervention.room_id == room_id))
    db.execute(delete(Diagnosis).where(Diagnosis.room_id == room_id))
    db.execute(delete(RoomFile).where(RoomFile.room_id == room_id))
    db.execute(delete(RoomInvitation).where(RoomInvitation.room_id == room_id))
    db.execute(delete(RoomReadState).where(RoomReadState.room_id == room_id))
    db.execute(delete(RoomMessage).where(RoomMessage.room_id == room_id))
    db.execute(delete(RoomMember).where(RoomMember.room_id == room_id))
    db.delete(room)
    db.flush()
    shutil.rmtree(room_upload_dir, ignore_errors=True)
