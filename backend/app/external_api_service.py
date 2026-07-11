from dataclasses import dataclass
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from .api_auth import ApiAuthContext, ensure_api_room_access
from .chat_schemas import MessageCreateIn, MessageOut
from .chat_service import metadata_for_message, message_text_with_attachments
from .diagnosis_service import create_diagnosis_record
from .diagnosis_serializers import diagnosis_out
from .events import publish_room_event
from .idempotency import idempotency_record, idempotent_message, remember_idempotency
from .message_serializers import message_out, metadata_with_attachments
from .models import Diagnosis, Room, RoomMessage, Task
from .task_serializers import task_out
from .task_service import create_task_record
from .work_request_schemas import WorkRequestIn, WorkRequestOut


@dataclass
class WorkRequestResources:
    message: RoomMessage
    diagnosis: Diagnosis | None
    task: Task | None
    idempotent: bool = False


@dataclass
class ApiMessageResources:
    message: RoomMessage
    idempotent: bool = False


def ensure_room_exists(db: Session, room_id: str) -> None:
    if not db.scalar(select(Room).where(Room.id == room_id)):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")


def list_accessible_rooms(db: Session, auth: ApiAuthContext) -> list[Room]:
    stmt = select(Room).order_by(Room.created_at)
    if auth.client and auth.client.room_id:
        stmt = stmt.where(Room.id == auth.client.room_id)
    return list(db.scalars(stmt).all())


def list_room_messages(
    db: Session,
    auth: ApiAuthContext,
    room_id: str,
    limit: int,
    since: datetime | None,
) -> list[RoomMessage]:
    ensure_api_room_access(auth, room_id)
    stmt = select(RoomMessage).where(RoomMessage.room_id == room_id, RoomMessage.deleted_at.is_(None))
    if since:
        stmt = stmt.where(RoomMessage.created_at > since)
    messages = db.scalars(stmt.order_by(desc(RoomMessage.created_at)).limit(limit)).all()
    return list(reversed(messages))


def list_accessible_tasks(
    db: Session,
    auth: ApiAuthContext,
    room_id: str | None,
    status_filter: str | None,
    assignee: str | None,
    limit: int,
) -> tuple[str | None, list[Task]]:
    resolved_room_id = auth.client.room_id if auth.client and auth.client.room_id else room_id
    stmt = select(Task)
    if resolved_room_id:
        ensure_api_room_access(auth, resolved_room_id)
        stmt = stmt.where(Task.room_id == resolved_room_id)
    if status_filter:
        stmt = stmt.where(Task.status == status_filter)
    if assignee:
        stmt = stmt.where(Task.assignee == assignee)
    tasks = db.scalars(stmt.order_by(desc(Task.created_at)).limit(limit)).all()
    return resolved_room_id, list(tasks)


def create_work_request_resources(
    db: Session,
    payload: WorkRequestIn,
    idempotency_key: str | None,
) -> WorkRequestResources:
    ensure_room_exists(db, payload.room_id)
    scope = f"work_request:{payload.room_id}"
    existing = idempotency_record(db, scope, idempotency_key, "work_request")
    if existing:
        message = db.scalar(select(RoomMessage).where(RoomMessage.id == existing.resource_id))
        if message:
            return WorkRequestResources(
                message=message,
                diagnosis=db.scalar(select(Diagnosis).where(Diagnosis.room_message_id == existing.resource_id)),
                task=db.scalar(select(Task).where(Task.room_message_id == existing.resource_id)),
                idempotent=True,
            )

    message = RoomMessage(
        room_id=payload.room_id,
        sender_type="agent",
        sender_name=payload.assignee or "External Agent",
        body=payload.body.strip(),
        metadata_json=metadata_with_attachments(
            {"work_request": payload.metadata or {}, "title": payload.title},
            payload.attachments,
        ),
    )
    db.add(message)
    db.flush()
    remember_idempotency(db, scope, idempotency_key, "work_request", message.id)

    diagnosis: Diagnosis | None = None
    if payload.diagnose_before_post:
        diagnosis = create_diagnosis_record(
            db,
            text=message_text_with_attachments(message),
            room_id=payload.room_id,
            user_id=None,
            room_message_id=message.id,
            source="external_api",
        )

    task: Task | None = None
    if payload.create_task:
        task = create_task_record(
            db,
            room_id=payload.room_id,
            diagnosis_id=diagnosis.id if diagnosis else None,
            room_message_id=message.id,
            title=payload.title,
            assignee=payload.assignee,
            due_date=payload.due_date,
            completion_condition=payload.completion_condition,
            metadata=payload.metadata,
        )

    return WorkRequestResources(message=message, diagnosis=diagnosis, task=task)


def work_request_out(resources: WorkRequestResources) -> WorkRequestOut:
    return WorkRequestOut(
        message_id=resources.message.id,
        diagnosis_id=resources.diagnosis.id if resources.diagnosis else None,
        task_id=resources.task.id if resources.task else None,
        status="created",
    )


async def publish_work_request_events(db: Session, resources: WorkRequestResources) -> None:
    if resources.idempotent:
        return
    await publish_room_event(
        db,
        resources.message.room_id,
        "message.created",
        message_out(resources.message).model_dump(mode="json"),
    )
    if resources.diagnosis:
        await publish_room_event(
            db,
            resources.message.room_id,
            "diagnosis.completed",
            diagnosis_out(resources.diagnosis).model_dump(mode="json"),
        )
    if resources.task:
        await publish_room_event(
            db,
            resources.message.room_id,
            "task.created",
            task_out(resources.task).model_dump(mode="json"),
        )


def create_api_message_resources(
    db: Session,
    room_id: str,
    payload: MessageCreateIn,
    idempotency_key: str | None,
) -> ApiMessageResources:
    ensure_room_exists(db, room_id)
    scope = f"api_message:{room_id}"
    existing_message = idempotent_message(db, scope, idempotency_key)
    if existing_message:
        return ApiMessageResources(message=existing_message, idempotent=True)

    stripped_body = payload.body.strip()
    message = RoomMessage(
        room_id=room_id,
        thread_id=payload.thread_id,
        sender_type=payload.sender_type or "agent",
        sender_name=payload.sender_name or "External Agent",
        body=stripped_body,
        metadata_json=metadata_for_message(
            db,
            room_id,
            stripped_body,
            None,
            payload.metadata,
            payload.attachments,
        ),
    )
    db.add(message)
    db.flush()
    remember_idempotency(db, scope, idempotency_key, "room_message", message.id)
    return ApiMessageResources(message=message)


def api_message_out(resources: ApiMessageResources) -> MessageOut:
    return message_out(resources.message)


async def publish_api_message_event(db: Session, resources: ApiMessageResources) -> None:
    if resources.idempotent:
        return
    await publish_room_event(
        db,
        resources.message.room_id,
        "message.created",
        message_out(resources.message).model_dump(mode="json"),
    )
