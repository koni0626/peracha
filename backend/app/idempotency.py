from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import IdempotencyRecord, RoomMessage


def idempotent_message(db: Session, scope: str, key: str | None) -> RoomMessage | None:
    if not key:
        return None
    record = db.scalar(
        select(IdempotencyRecord).where(
            IdempotencyRecord.scope == scope,
            IdempotencyRecord.key == key,
            IdempotencyRecord.resource_type == "room_message",
        )
    )
    if not record:
        return None
    return db.scalar(
        select(RoomMessage).where(RoomMessage.id == record.resource_id, RoomMessage.deleted_at.is_(None))
    )


def idempotency_record(db: Session, scope: str, key: str | None, resource_type: str) -> IdempotencyRecord | None:
    if not key:
        return None
    return db.scalar(
        select(IdempotencyRecord).where(
            IdempotencyRecord.scope == scope,
            IdempotencyRecord.key == key,
            IdempotencyRecord.resource_type == resource_type,
        )
    )


def remember_idempotency(db: Session, scope: str, key: str | None, resource_type: str, resource_id: str) -> None:
    if not key:
        return
    existing = db.scalar(select(IdempotencyRecord).where(IdempotencyRecord.scope == scope, IdempotencyRecord.key == key))
    if existing:
        return
    db.add(IdempotencyRecord(scope=scope, key=key, resource_type=resource_type, resource_id=resource_id))
