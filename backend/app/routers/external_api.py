from datetime import datetime

from fastapi import APIRouter, Depends, Header, Query, Request
from sqlalchemy.orm import Session

from ..api_auth import ApiAuthContext, ensure_api_room_access, ensure_api_scope, get_api_auth_context, record_audit_log
from ..chat_schemas import MessageCreateIn, MessageOut
from ..database import get_db
from ..events import publish_room_event
from ..external_api_service import (
    api_message_out,
    create_api_message_resources,
    create_work_request_resources,
    list_accessible_rooms,
    list_accessible_tasks,
    list_room_messages,
    publish_api_message_event,
    publish_work_request_events,
    work_request_out,
)
from ..api_integration_schemas import WebhookCreateIn, WebhookOut
from ..room_schemas import RoomOut
from ..room_serializers import room_out
from ..schemas import PageOut
from ..api_serializers import webhook_out
from ..message_serializers import message_out
from ..task_serializers import task_out
from ..task_schemas import TaskOut, TaskUpdateIn
from ..task_service import apply_task_update, get_task_or_404
from ..webhook_service import create_webhook_endpoint, list_webhook_endpoints
from ..work_request_schemas import WorkRequestIn, WorkRequestOut

router = APIRouter(prefix="/api/v1", tags=["external-api"])


@router.get("/rooms", response_model=PageOut[RoomOut])
def api_rooms(
    request: Request,
    auth: ApiAuthContext = Depends(get_api_auth_context),
    db: Session = Depends(get_db),
) -> PageOut[RoomOut]:
    ensure_api_scope(auth, "rooms:read")
    rooms = list_accessible_rooms(db, auth)
    record_audit_log(db, auth, "rooms.read", request.method, request.url.path, room_id=auth.client.room_id if auth.client else None)
    db.commit()
    return PageOut[RoomOut](items=[room_out(room) for room in rooms])


@router.get("/rooms/{room_id}/messages", response_model=PageOut[MessageOut])
def api_messages(
    request: Request,
    room_id: str,
    limit: int = Query(default=50, ge=1, le=100),
    since: datetime | None = None,
    auth: ApiAuthContext = Depends(get_api_auth_context),
    db: Session = Depends(get_db),
) -> PageOut[MessageOut]:
    ensure_api_scope(auth, "messages:read")
    messages = list_room_messages(db, auth, room_id, limit, since)
    record_audit_log(db, auth, "messages.read", request.method, request.url.path, room_id=room_id)
    db.commit()
    return PageOut[MessageOut](items=[message_out(message) for message in messages])


@router.post("/work-requests", response_model=WorkRequestOut)
async def api_create_work_request(
    request: Request,
    payload: WorkRequestIn,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
    auth: ApiAuthContext = Depends(get_api_auth_context),
    db: Session = Depends(get_db),
) -> WorkRequestOut:
    ensure_api_scope(auth, "messages:write")
    if payload.diagnose_before_post:
        ensure_api_scope(auth, "diagnoses:write")
    if payload.create_task:
        ensure_api_scope(auth, "tasks:write")
    ensure_api_room_access(auth, payload.room_id)
    resources = create_work_request_resources(db, payload, idempotency_key)
    output = work_request_out(resources)
    if resources.idempotent:
        record_audit_log(
            db,
            auth,
            "work_requests.create",
            request.method,
            request.url.path,
            room_id=payload.room_id,
            resource_type="room_message",
            resource_id=resources.message.id,
            metadata={"idempotent": True},
        )
        db.commit()
        return output

    db.commit()
    db.refresh(resources.message)
    if resources.diagnosis:
        db.refresh(resources.diagnosis)
    if resources.task:
        db.refresh(resources.task)

    await publish_work_request_events(db, resources)
    record_audit_log(
        db,
        auth,
        "work_requests.create",
        request.method,
        request.url.path,
        room_id=payload.room_id,
        resource_type="room_message",
        resource_id=resources.message.id,
        metadata={
            "task_id": resources.task.id if resources.task else None,
            "diagnosis_id": resources.diagnosis.id if resources.diagnosis else None,
        },
    )
    db.commit()
    return output


@router.get("/tasks", response_model=PageOut[TaskOut])
def api_tasks(
    request: Request,
    room_id: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    assignee: str | None = None,
    limit: int = Query(default=50, ge=1, le=100),
    auth: ApiAuthContext = Depends(get_api_auth_context),
    db: Session = Depends(get_db),
) -> PageOut[TaskOut]:
    ensure_api_scope(auth, "tasks:read")
    room_id, tasks = list_accessible_tasks(db, auth, room_id, status_filter, assignee, limit)
    record_audit_log(db, auth, "tasks.read", request.method, request.url.path, room_id=room_id)
    db.commit()
    return PageOut[TaskOut](items=[task_out(task) for task in tasks])


@router.patch("/tasks/{task_id}", response_model=TaskOut)
async def api_update_task(
    request: Request,
    task_id: str,
    payload: TaskUpdateIn,
    auth: ApiAuthContext = Depends(get_api_auth_context),
    db: Session = Depends(get_db),
) -> TaskOut:
    ensure_api_scope(auth, "tasks:write")
    task = get_task_or_404(db, task_id)
    ensure_api_room_access(auth, task.room_id)
    apply_task_update(task, payload)
    db.commit()
    db.refresh(task)
    output = task_out(task)
    await publish_room_event(db, task.room_id, "task.updated", output.model_dump(mode="json"))
    record_audit_log(db, auth, "tasks.update", request.method, request.url.path, room_id=task.room_id, resource_type="task", resource_id=task.id)
    db.commit()
    return output


@router.post("/webhooks", response_model=WebhookOut)
def api_create_webhook(
    request: Request,
    payload: WebhookCreateIn,
    auth: ApiAuthContext = Depends(get_api_auth_context),
    db: Session = Depends(get_db),
) -> WebhookOut:
    ensure_api_scope(auth, "webhooks:write")
    webhook = create_webhook_endpoint(db, auth, payload)
    db.commit()
    db.refresh(webhook)
    output = webhook_out(webhook)
    record_audit_log(db, auth, "webhooks.create", request.method, request.url.path, room_id=payload.room_id, resource_type="webhook", resource_id=webhook.id)
    db.commit()
    return output


@router.get("/webhooks", response_model=PageOut[WebhookOut])
def api_webhooks(
    request: Request,
    room_id: str | None = None,
    auth: ApiAuthContext = Depends(get_api_auth_context),
    db: Session = Depends(get_db),
) -> PageOut[WebhookOut]:
    ensure_api_scope(auth, "webhooks:write")
    room_id, webhooks = list_webhook_endpoints(db, auth, room_id)
    record_audit_log(db, auth, "webhooks.read", request.method, request.url.path, room_id=room_id)
    db.commit()
    return PageOut[WebhookOut](items=[webhook_out(webhook) for webhook in webhooks])


@router.post("/rooms/{room_id}/messages", response_model=MessageOut)
async def api_create_message(
    request: Request,
    room_id: str,
    payload: MessageCreateIn,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
    auth: ApiAuthContext = Depends(get_api_auth_context),
    db: Session = Depends(get_db),
) -> MessageOut:
    ensure_api_scope(auth, "messages:write")
    ensure_api_room_access(auth, room_id)
    resources = create_api_message_resources(db, room_id, payload, idempotency_key)
    if resources.idempotent:
        record_audit_log(
            db,
            auth,
            "messages.create",
            request.method,
            request.url.path,
            room_id=room_id,
            resource_type="room_message",
            resource_id=resources.message.id,
            metadata={"idempotent": True},
        )
        db.commit()
        return api_message_out(resources)

    db.commit()
    db.refresh(resources.message)
    output = api_message_out(resources)
    await publish_api_message_event(db, resources)
    record_audit_log(db, auth, "messages.create", request.method, request.url.path, room_id=room_id, resource_type="room_message", resource_id=resources.message.id)
    db.commit()
    return output
