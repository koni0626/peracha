from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select

from ..database import SessionLocal
from ..models import RoomMember
from ..rate_limits import allow_websocket_typing_event
from ..security import get_websocket_user
from ..websocket_manager import manager

router = APIRouter(tags=["websockets"])


@router.websocket("/ws/rooms/{room_id}")
async def room_websocket(websocket: WebSocket, room_id: str) -> None:
    db = SessionLocal()
    connected = False
    try:
        user = await get_websocket_user(websocket, db)
        if not user:
            await websocket.close(code=4401)
            return
        member = db.scalar(select(RoomMember).where(RoomMember.room_id == room_id, RoomMember.user_id == user.id))
        if not member:
            await websocket.close(code=4403)
            return

        can_connect, limit_reason = manager.can_connect(room_id, user.id)
        if not can_connect:
            await websocket.close(code=4408, reason=limit_reason or "connection_limit")
            return

        await manager.connect(room_id, user.id, websocket)
        connected = True
        while True:
            payload = await websocket.receive_json()
            event = payload.get("event")
            if event in {"typing.started", "typing.stopped"}:
                if not allow_websocket_typing_event(f"{room_id}:{user.id}"):
                    await websocket.send_json(
                        {
                            "event": "typing.rate_limited",
                            "room_id": room_id,
                            "data": {"retry_after_seconds": 60},
                        }
                    )
                    continue
                await manager.publish(
                    room_id,
                    {
                        "event": event,
                        "room_id": room_id,
                        "data": {"user_id": user.id, "sender_name": user.name},
                    },
                )
    except WebSocketDisconnect:
        pass
    finally:
        if connected:
            manager.disconnect(room_id, websocket)
        db.close()
