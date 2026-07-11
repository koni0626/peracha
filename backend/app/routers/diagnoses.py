from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..diagnosis_serializers import diagnosis_out
from ..diagnosis_schemas import DiagnosisCreateIn, DiagnosisOut
from ..diagnosis_service import create_diagnosis_record
from ..events import publish_room_event
from ..models import Diagnosis, RoomMember, User
from ..permissions import ensure_room_member
from ..schemas import PageOut
from ..security import get_current_user

router = APIRouter(prefix="/api/diagnoses", tags=["diagnoses"])


@router.post("", response_model=DiagnosisOut)
async def create_diagnosis(
    payload: DiagnosisCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DiagnosisOut:
    if payload.room_id:
        ensure_room_member(db, payload.room_id, current_user.id)
    diagnosis = create_diagnosis_record(
        db,
        text=payload.text,
        room_id=payload.room_id,
        user_id=current_user.id,
        room_message_id=payload.room_message_id,
        source=payload.source,
        form_answers=payload.form_answers,
    )
    db.commit()
    db.refresh(diagnosis)
    output = diagnosis_out(diagnosis)
    if payload.room_id:
        await publish_room_event(db, payload.room_id, "diagnosis.completed", output.model_dump(mode="json"))
    return output


@router.get("", response_model=PageOut[DiagnosisOut])
def list_diagnoses(
    room_id: str | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[DiagnosisOut]:
    stmt = select(Diagnosis)
    if room_id:
        ensure_room_member(db, room_id, current_user.id)
        stmt = stmt.where(Diagnosis.room_id == room_id)
    else:
        room_ids = db.scalars(select(RoomMember.room_id).where(RoomMember.user_id == current_user.id)).all()
        stmt = stmt.where(Diagnosis.room_id.in_(room_ids))
    diagnoses = db.scalars(stmt.order_by(desc(Diagnosis.created_at)).limit(limit)).all()
    return PageOut[DiagnosisOut](items=[diagnosis_out(diagnosis) for diagnosis in diagnoses])
