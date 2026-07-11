import json

from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..care import generate_care_intervention
from ..diagnosis_service import board_suggestion_out
from ..events import publish_room_event
from ..database import get_db
from ..facilitator import ContextMessage
from ..message_serializers import message_out
from ..models import CareIntervention, RoomMessage, User
from ..permissions import ensure_room_member
from ..schemas import PageOut
from ..security import get_current_user
from ..task_serializers import care_out
from ..task_schemas import CareCreateIn, CareOut

router = APIRouter(prefix="/api/care-interventions", tags=["care"])


@router.post("", response_model=CareOut)
async def create_care_intervention(
    payload: CareCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CareOut:
    ensure_room_member(db, payload.room_id, current_user.id)
    stmt = select(RoomMessage).where(RoomMessage.room_id == payload.room_id, RoomMessage.deleted_at.is_(None))
    if payload.message_ids:
        stmt = stmt.where(RoomMessage.id.in_(payload.message_ids))
        messages = db.scalars(stmt.order_by(RoomMessage.created_at).limit(80)).all()
    else:
        messages = list(reversed(db.scalars(stmt.order_by(desc(RoomMessage.created_at)).limit(30)).all()))

    contexts = [
        ContextMessage(id=message.id, body=message.body, sender_name=message.sender_name, created_at=message.created_at)
        for message in messages
    ]
    result = generate_care_intervention(contexts)
    care = CareIntervention(
        room_id=payload.room_id,
        care_type=result["care_type"],
        emotional_summary=result["emotional_summary"],
        issue_summary=result["issue_summary"],
        fact_check_points_json=json.dumps(result["fact_check_points"], ensure_ascii=False),
        decision_criteria_json=json.dumps(result["decision_criteria"], ensure_ascii=False),
        facilitator_reply=result["facilitator_reply"],
        suggest_board="true" if result["suggest_board"] else "false",
    )
    db.add(care)
    db.flush()

    facilitator_message = RoomMessage(
        room_id=payload.room_id,
        sender_type="facilitator",
        sender_name="AIファシリ",
        body=care.facilitator_reply,
        metadata_json=json.dumps({"care_id": care.id, "trigger": payload.trigger}, ensure_ascii=False),
    )
    db.add(facilitator_message)
    db.commit()
    db.refresh(care)
    db.refresh(facilitator_message)
    output = care_out(care)
    await publish_room_event(db, payload.room_id, "care.created", output.model_dump(mode="json"))
    await publish_room_event(db, payload.room_id, "message.created", message_out(facilitator_message).model_dump(mode="json"))
    if output.suggest_board:
        suggestion = board_suggestion_out(
            payload.room_id,
            "care",
            "論点ケアの結果、会話の現在地をボード化すると整理しやすい状態です。",
            [message.id for message in messages[-10:]],
        )
        await publish_room_event(db, payload.room_id, "board.suggested", suggestion.model_dump(mode="json"))
    return output


@router.get("", response_model=PageOut[CareOut])
def list_care_interventions(
    room_id: str,
    limit: int = Query(default=10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[CareOut]:
    ensure_room_member(db, room_id, current_user.id)
    care_items = db.scalars(
        select(CareIntervention).where(CareIntervention.room_id == room_id).order_by(desc(CareIntervention.created_at)).limit(limit)
    ).all()
    return PageOut[CareOut](items=[care_out(item) for item in care_items])
