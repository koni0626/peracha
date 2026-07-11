import json
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Diagnosis, Room, RoomMember, RoomMessage, Task
from .task_schemas import TaskUpdateIn


def resolve_task_room_id(
    db: Session,
    room_id: str | None,
    diagnosis_id: str | None,
    room_message_id: str | None,
) -> str:
    resolved_room_id = room_id
    if diagnosis_id:
        diagnosis = db.scalar(select(Diagnosis).where(Diagnosis.id == diagnosis_id))
        if not diagnosis:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diagnosis not found")
        if not diagnosis.room_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Diagnosis is not linked to a room")
        resolved_room_id = resolved_room_id or diagnosis.room_id
        if resolved_room_id != diagnosis.room_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Task room does not match diagnosis")
    if room_message_id:
        message = db.scalar(select(RoomMessage).where(RoomMessage.id == room_message_id))
        if not message:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room message not found")
        resolved_room_id = resolved_room_id or message.room_id
        if resolved_room_id != message.room_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Task room does not match message")
    if not resolved_room_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="room_id is required")
    if not db.scalar(select(Room).where(Room.id == resolved_room_id)):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return resolved_room_id


def create_task_record(
    db: Session,
    room_id: str,
    title: str,
    diagnosis_id: str | None = None,
    room_message_id: str | None = None,
    assignee: str | None = None,
    due_date: datetime | None = None,
    completion_condition: str | None = None,
    metadata: dict | None = None,
) -> Task:
    task = Task(
        room_id=room_id,
        diagnosis_id=diagnosis_id,
        room_message_id=room_message_id,
        title=title,
        assignee=assignee,
        due_date=due_date,
        completion_condition=completion_condition,
        metadata_json=json.dumps(metadata, ensure_ascii=False) if metadata else None,
    )
    db.add(task)
    db.flush()
    return task


def get_task_or_404(db: Session, task_id: str) -> Task:
    task = db.scalar(select(Task).where(Task.id == task_id))
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


def visible_task_room_ids(db: Session, user_id: str, room_id: str | None) -> list[str]:
    if room_id:
        return [room_id]
    return list(db.scalars(select(RoomMember.room_id).where(RoomMember.user_id == user_id)).all())


def apply_task_update(task: Task, payload: TaskUpdateIn) -> Task:
    if payload.status is not None:
        task.status = payload.status
    if payload.assignee is not None:
        task.assignee = payload.assignee
    if payload.due_date is not None:
        task.due_date = payload.due_date
    if payload.completion_condition is not None:
        task.completion_condition = payload.completion_condition
    if payload.progress_note is not None:
        task.progress_note = payload.progress_note
    if payload.result_message_id is not None:
        task.result_message_id = payload.result_message_id
    task.updated_at = datetime.now(timezone.utc)
    return task
