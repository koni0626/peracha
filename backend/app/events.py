import hashlib
import hmac
import json
import time

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import settings
from .models import WebhookEndpoint
from .serializer_utils import json_list
from .websocket_manager import manager


def sign_webhook_payload(payload: dict) -> str:
    body = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hmac.new(settings.webhook_signing_secret.encode("utf-8"), body.encode("utf-8"), hashlib.sha256).hexdigest()


def send_webhooks(db: Session, room_id: str, event: str, data: dict) -> None:
    payload = {
        "event": event,
        "room_id": room_id,
        "data": data,
        "sent_at": int(time.time()),
    }
    endpoints = db.scalars(
        select(WebhookEndpoint).where(
            WebhookEndpoint.active == "true",
            (WebhookEndpoint.room_id == room_id) | (WebhookEndpoint.room_id.is_(None)),
        )
    ).all()
    targets = [endpoint for endpoint in endpoints if event in json_list(endpoint.events_json)]
    if not targets:
        return
    headers = {
        "Content-Type": "application/json",
        "X-Sapiens-Event": event,
        "X-Sapiens-Signature": sign_webhook_payload(payload),
    }
    with httpx.Client(timeout=3.0) as client:
        for endpoint in targets:
            try:
                client.post(endpoint.url, json=payload, headers=headers)
            except httpx.HTTPError:
                continue


async def publish_room_event(db: Session, room_id: str, event: str, data: dict) -> None:
    await manager.publish(room_id, {"event": event, "room_id": room_id, "data": data})
    send_webhooks(db, room_id, event, data)
