import json

from fastapi import HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from .api_auth import ApiAuthContext, ensure_api_room_access
from .api_security import webhook_secret_hash
from .api_integration_schemas import WebhookCreateIn
from .models import Room, WebhookEndpoint


def create_webhook_endpoint(db: Session, auth: ApiAuthContext, payload: WebhookCreateIn) -> WebhookEndpoint:
    if auth.client and auth.client.room_id and payload.room_id != auth.client.room_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="API client cannot create global webhooks")
    if payload.room_id and not db.scalar(select(Room).where(Room.id == payload.room_id)):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    webhook = WebhookEndpoint(
        room_id=payload.room_id,
        url=payload.url,
        events_json=json.dumps(payload.events, ensure_ascii=False),
        secret_hash=webhook_secret_hash(payload.secret),
    )
    db.add(webhook)
    return webhook


def list_webhook_endpoints(
    db: Session,
    auth: ApiAuthContext,
    room_id: str | None,
) -> tuple[str | None, list[WebhookEndpoint]]:
    resolved_room_id = auth.client.room_id if auth.client and auth.client.room_id else room_id
    stmt = select(WebhookEndpoint)
    if resolved_room_id:
        ensure_api_room_access(auth, resolved_room_id)
        stmt = stmt.where(WebhookEndpoint.room_id == resolved_room_id)
    webhooks = db.scalars(stmt.order_by(desc(WebhookEndpoint.created_at))).all()
    return resolved_room_id, list(webhooks)
