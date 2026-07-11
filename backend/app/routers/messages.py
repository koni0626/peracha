from datetime import datetime

from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.orm import Session

from ..chat_schemas import MessageCreateIn, MessageOut, RoomReadStateUpdateIn
from ..chat_service import search_room_contexts
from ..database import get_db
from ..events import publish_room_event
from ..message_serializers import message_out
from ..message_service import create_user_message, list_recent_room_messages, mark_room_read_state, resolve_read_target_message
from ..models import User
from ..permissions import ensure_room_member
from ..diagnosis_schemas import RelatedContextOut
from ..schemas import PageOut
from ..security import get_current_user

router = APIRouter(prefix="/api/rooms/{room_id}", tags=["messages"])


@router.get("/messages", response_model=PageOut[MessageOut])
def list_messages(
    room_id: str,
    limit: int = Query(default=50, ge=1, le=100),
    since: datetime | None = None,
    thread_id: str | None = Query(default=None, max_length=120),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[MessageOut]:
    ensure_room_member(db, room_id, current_user.id)
    messages = list_recent_room_messages(db, room_id, limit, since, thread_id)
    return PageOut[MessageOut](items=[message_out(message, db, current_user) for message in messages])


@router.post("/read-state", response_model=PageOut[MessageOut])
async def mark_room_read(
    room_id: str,
    payload: RoomReadStateUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[MessageOut]:
    ensure_room_member(db, room_id, current_user.id)
    target_message = resolve_read_target_message(db, room_id, payload.message_id)
    if not target_message:
        return PageOut[MessageOut](items=[])

    mark_room_read_state(db, room_id, current_user.id, target_message)
    db.commit()

    messages = list_recent_room_messages(db, room_id, 100)
    items = [message_out(message, db, current_user) for message in messages]
    await publish_room_event(
        db,
        room_id,
        "message.read_state.updated",
        {"reader_user_id": current_user.id, "last_read_at": target_message.created_at.isoformat()},
    )
    return PageOut[MessageOut](items=items)


@router.get("/contexts", response_model=PageOut[RelatedContextOut])
def list_room_contexts(
    room_id: str,
    q: str = Query(default="", max_length=200),
    limit: int = Query(default=5, ge=1, le=20),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[RelatedContextOut]:
    ensure_room_member(db, room_id, current_user.id)
    return PageOut[RelatedContextOut](items=search_room_contexts(db, room_id, q, limit))


@router.post("/messages", response_model=MessageOut)
async def create_message(
    room_id: str,
    payload: MessageCreateIn,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageOut:
    ensure_room_member(db, room_id, current_user.id)
    message, idempotent = create_user_message(db, room_id, payload, current_user, idempotency_key)
    if idempotent:
        return message_out(message, db, current_user)
    db.commit()
    db.refresh(message)

    output = message_out(message, db, current_user)
    await publish_room_event(db, room_id, "message.created", output.model_dump(mode="json"))
    return output
