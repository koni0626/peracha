from __future__ import annotations

import asyncio
import json
import logging
from collections import defaultdict
from contextlib import suppress

from fastapi import WebSocket

try:
    from redis.asyncio import Redis
except ImportError:  # pragma: no cover - redis is optional unless REDIS_URL is configured.
    Redis = None  # type: ignore[assignment]

from .config import settings


logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self) -> None:
        self._rooms: dict[str, set[WebSocket]] = defaultdict(set)
        self._users: dict[tuple[str, str], set[WebSocket]] = defaultdict(set)
        self._socket_index: dict[WebSocket, tuple[str, str]] = {}
        self._redis: Redis | None = None
        self._subscriber_task: asyncio.Task | None = None
        self._channel = "sapiens-chat:room-events"

    def room_connection_count(self, room_id: str) -> int:
        return len(self._rooms.get(room_id, set()))

    def user_connection_count(self, room_id: str, user_id: str) -> int:
        return len(self._users.get((room_id, user_id), set()))

    def can_connect(self, room_id: str, user_id: str) -> tuple[bool, str | None]:
        room_limit = settings.websocket_max_connections_per_room
        user_limit = settings.websocket_max_connections_per_user
        if room_limit > 0 and self.room_connection_count(room_id) >= room_limit:
            return False, "room_connection_limit"
        if user_limit > 0 and self.user_connection_count(room_id, user_id) >= user_limit:
            return False, "user_connection_limit"
        return True, None

    async def connect(self, room_id: str, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self._rooms[room_id].add(websocket)
        self._users[(room_id, user_id)].add(websocket)
        self._socket_index[websocket] = (room_id, user_id)

    def disconnect(self, room_id: str, websocket: WebSocket) -> None:
        self._rooms[room_id].discard(websocket)
        if not self._rooms[room_id]:
            self._rooms.pop(room_id, None)
        indexed = self._socket_index.pop(websocket, None)
        if indexed:
            user_key = indexed
            self._users[user_key].discard(websocket)
            if not self._users[user_key]:
                self._users.pop(user_key, None)

    async def start(self) -> None:
        if not settings.redis_url or self._redis is not None:
            return
        if Redis is None:
            logger.warning("REDIS_URL is configured, but redis package is not installed. Falling back to local WebSocket only.")
            return
        self._redis = Redis.from_url(settings.redis_url, decode_responses=True)
        self._subscriber_task = asyncio.create_task(self._listen_for_redis_events())

    async def stop(self) -> None:
        if self._subscriber_task:
            self._subscriber_task.cancel()
            with suppress(asyncio.CancelledError):
                await self._subscriber_task
            self._subscriber_task = None
        if self._redis:
            await self._redis.aclose()
            self._redis = None

    async def publish(self, room_id: str, payload: dict) -> None:
        if self._redis:
            try:
                await self._redis.publish(self._channel, json.dumps({"room_id": room_id, "payload": payload}, ensure_ascii=False))
                return
            except Exception:
                logger.exception("Redis publish failed. Falling back to local WebSocket broadcast.")
        await self.broadcast_local(room_id, payload)

    async def broadcast_local(self, room_id: str, payload: dict) -> None:
        disconnected: list[WebSocket] = []
        for websocket in list(self._rooms.get(room_id, set())):
            try:
                await websocket.send_json(payload)
            except Exception:
                disconnected.append(websocket)
        for websocket in disconnected:
            self.disconnect(room_id, websocket)

    async def _listen_for_redis_events(self) -> None:
        if not self._redis:
            return
        pubsub = self._redis.pubsub()
        await pubsub.subscribe(self._channel)
        try:
            async for message in pubsub.listen():
                if message.get("type") != "message":
                    continue
                try:
                    envelope = json.loads(message["data"])
                    await self.broadcast_local(envelope["room_id"], envelope["payload"])
                except Exception:
                    logger.exception("Failed to process Redis WebSocket event.")
        finally:
            await pubsub.unsubscribe(self._channel)
            await pubsub.aclose()


manager = ConnectionManager()
