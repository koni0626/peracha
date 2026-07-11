from datetime import datetime, timezone

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from .chat_schemas import MessageCreateIn
from .chat_service import metadata_for_message
from .idempotency import idempotent_message, remember_idempotency
from .models import RoomMessage, RoomReadState, User
from .rate_limits import enforce_message_post_rate_limit


def _reply_to_metadata(db: Session, room_id: str, reply_to_message_id: str | None) -> dict | None:
    if not reply_to_message_id:
        return None
    reply_to = db.scalar(
        select(RoomMessage).where(
            RoomMessage.id == reply_to_message_id,
            RoomMessage.room_id == room_id,
            RoomMessage.deleted_at.is_(None),
        )
    )
    if not reply_to:
        return None
    excerpt = reply_to.body.strip()
    return {
        "id": reply_to.id,
        "sender_name": reply_to.sender_name or reply_to.sender_type,
        "body": excerpt[:160],
        "created_at": reply_to.created_at.isoformat(),
    }


def list_recent_room_messages(
    db: Session,
    room_id: str,
    limit: int,
    since: datetime | None = None,
    thread_id: str | None = None,
) -> list[RoomMessage]:
    stmt = select(RoomMessage).where(RoomMessage.room_id == room_id, RoomMessage.deleted_at.is_(None))
    if thread_id:
        stmt = stmt.where(RoomMessage.thread_id == thread_id)
    else:
        stmt = stmt.where(RoomMessage.thread_id.is_(None))
    if since:
        stmt = stmt.where(RoomMessage.created_at > since)
    messages = db.scalars(stmt.order_by(desc(RoomMessage.created_at)).limit(limit)).all()
    return list(reversed(messages))


def create_user_message(
    db: Session,
    room_id: str,
    payload: MessageCreateIn,
    current_user: User,
    idempotency_key: str | None,
) -> tuple[RoomMessage, bool]:
    scope = f"user_message:{room_id}:{current_user.id}"
    existing_message = idempotent_message(db, scope, idempotency_key)
    if existing_message:
        return existing_message, True

    enforce_message_post_rate_limit(current_user.id)
    stripped_body = payload.body.strip()
    metadata = dict(payload.metadata or {})
    reply_to = _reply_to_metadata(db, room_id, payload.reply_to_message_id)
    if reply_to:
        metadata["reply_to"] = reply_to
        metadata["reply_to_message_id"] = reply_to["id"]
    message = RoomMessage(
        room_id=room_id,
        thread_id=payload.thread_id,
        sender_user_id=current_user.id,
        sender_type="user",
        sender_name=current_user.name,
        body=stripped_body,
        metadata_json=metadata_for_message(
            db,
            room_id,
            stripped_body,
            current_user.id,
            metadata,
            payload.attachments,
            payload.stamps,
        ),
    )
    db.add(message)
    db.flush()
    remember_idempotency(db, scope, idempotency_key, "room_message", message.id)
    return message, False


def resolve_read_target_message(db: Session, room_id: str, message_id: str | None) -> RoomMessage | None:
    if message_id:
        target_message = db.scalar(
            select(RoomMessage).where(
                RoomMessage.id == message_id,
                RoomMessage.room_id == room_id,
                RoomMessage.deleted_at.is_(None),
            )
        )
        if target_message:
            return target_message
    return db.scalars(
        select(RoomMessage)
        .where(RoomMessage.room_id == room_id, RoomMessage.deleted_at.is_(None))
        .order_by(desc(RoomMessage.created_at))
        .limit(1)
    ).first()


def mark_room_read_state(db: Session, room_id: str, user_id: str, target_message: RoomMessage) -> None:
    state = db.scalar(select(RoomReadState).where(RoomReadState.room_id == room_id, RoomReadState.user_id == user_id))
    if state:
        if not state.last_read_at or state.last_read_at < target_message.created_at:
            state.last_read_at = target_message.created_at
        state.updated_at = datetime.now(timezone.utc)
    else:
        db.add(RoomReadState(room_id=room_id, user_id=user_id, last_read_at=target_message.created_at))
