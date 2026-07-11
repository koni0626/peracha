from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..events import publish_room_event
from ..models import Task, User
from ..permissions import ensure_room_member
from ..schemas import PageOut
from ..security import get_current_user
from ..task_serializers import task_out
from ..task_schemas import TaskCreateIn, TaskOut, TaskUpdateIn
from ..task_service import apply_task_update, create_task_record, get_task_or_404, resolve_task_room_id, visible_task_room_ids

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post("", response_model=TaskOut)
async def create_task(
    payload: TaskCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskOut:
    room_id = resolve_task_room_id(db, payload.room_id, payload.diagnosis_id, payload.room_message_id)
    ensure_room_member(db, room_id, current_user.id)
    task = create_task_record(
        db,
        room_id=room_id,
        diagnosis_id=payload.diagnosis_id,
        room_message_id=payload.room_message_id,
        title=payload.title,
        assignee=payload.assignee,
        due_date=payload.due_date,
        completion_condition=payload.completion_condition,
        metadata=payload.metadata,
    )
    db.commit()
    db.refresh(task)
    output = task_out(task)
    await publish_room_event(db, task.room_id, "task.created", output.model_dump(mode="json"))
    return output


@router.get("", response_model=PageOut[TaskOut])
def list_tasks(
    room_id: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    assignee: str | None = None,
    limit: int = Query(default=50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[TaskOut]:
    if room_id:
        ensure_room_member(db, room_id, current_user.id)
    room_ids = visible_task_room_ids(db, current_user.id, room_id)
    stmt = select(Task).where(Task.room_id.in_(room_ids))
    if status_filter:
        stmt = stmt.where(Task.status == status_filter)
    if assignee:
        stmt = stmt.where(Task.assignee == assignee)
    tasks = db.scalars(stmt.order_by(desc(Task.created_at)).limit(limit)).all()
    return PageOut[TaskOut](items=[task_out(task) for task in tasks])


@router.patch("/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: str,
    payload: TaskUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> TaskOut:
    task = get_task_or_404(db, task_id)
    ensure_room_member(db, task.room_id, current_user.id)
    apply_task_update(task, payload)
    db.commit()
    db.refresh(task)
    output = task_out(task)
    await publish_room_event(db, task.room_id, "task.updated", output.model_dump(mode="json"))
    return output
