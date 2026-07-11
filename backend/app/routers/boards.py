import json

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..ai_image_client import generate_board_image_with_openai
from ..board_serializers import board_out
from ..board_schemas import BoardCreateIn, BoardOut
from ..board_service import create_board_svg, summarize_board
from ..config import settings
from ..database import get_db
from ..events import publish_room_event
from ..models import NowHereBoard, Room, RoomMessage, User
from ..permissions import ensure_room_member
from ..schemas import PageOut
from ..security import get_current_user

router = APIRouter(prefix="/api/boards", tags=["boards"])


@router.post("", response_model=BoardOut)
async def create_board(
    payload: BoardCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BoardOut:
    ensure_room_member(db, payload.room_id, current_user.id)
    room = db.scalar(select(Room).where(Room.id == payload.room_id))
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    stmt = select(RoomMessage).where(RoomMessage.room_id == payload.room_id, RoomMessage.deleted_at.is_(None))
    if payload.message_ids:
        stmt = stmt.where(RoomMessage.id.in_(payload.message_ids))
    messages = db.scalars(stmt.order_by(RoomMessage.created_at).limit(80)).all()
    summary = summarize_board(room, messages)
    image_model = payload.image_model or settings.openai_image_model
    image_url = generate_board_image_with_openai(summary, image_model) or create_board_svg(summary)
    board = NowHereBoard(
        room_id=payload.room_id,
        title=str(summary.get("title", f"{room.name} の今ここ")),
        image_url=image_url,
        image_model=image_model,
        summary_json=json.dumps(summary, ensure_ascii=False),
        prompt=f"trigger={payload.trigger}",
    )
    db.add(board)
    db.commit()
    db.refresh(board)
    output = board_out(board)
    await publish_room_event(db, payload.room_id, "board.created", output.model_dump(mode="json"))
    return output


@router.get("", response_model=PageOut[BoardOut])
def list_boards(
    room_id: str,
    limit: int = Query(default=10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[BoardOut]:
    ensure_room_member(db, room_id, current_user.id)
    boards = db.scalars(
        select(NowHereBoard).where(NowHereBoard.room_id == room_id).order_by(desc(NowHereBoard.created_at)).limit(limit)
    ).all()
    return PageOut[BoardOut](items=[board_out(board) for board in boards])
