import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..invitations import aware_datetime, invitation_token_hash, refresh_invitation_status, send_invitation_email
from ..models import Room, RoomInvitation, RoomMember, User
from ..permissions import ensure_room_admin
from ..room_serializers import invitation_out, room_out
from ..room_schemas import InvitationAcceptOut, InvitationCreateIn, InvitationOut
from ..schemas import PageOut
from ..security import get_current_user


router = APIRouter(tags=["invitations"])


@router.get("/api/rooms/{room_id}/invitations", response_model=PageOut[InvitationOut])
def list_room_invitations(
    room_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[InvitationOut]:
    ensure_room_admin(db, room_id, current_user.id)
    invitations = db.scalars(
        select(RoomInvitation)
        .where(RoomInvitation.room_id == room_id)
        .order_by(desc(RoomInvitation.created_at))
    ).all()
    changed = False
    for invitation in invitations:
        before = invitation.status
        refresh_invitation_status(invitation)
        changed = changed or before != invitation.status
    if changed:
        db.commit()
    return PageOut[InvitationOut](items=[invitation_out(invitation) for invitation in invitations])


@router.post("/api/rooms/{room_id}/invitations", response_model=InvitationOut)
def create_invitation(
    room_id: str,
    payload: InvitationCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InvitationOut:
    ensure_room_admin(db, room_id, current_user.id)
    room = db.scalar(select(Room).where(Room.id == room_id))
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    token = secrets.token_urlsafe(32)
    invitation = RoomInvitation(
        room_id=room_id,
        invited_email=payload.email.lower(),
        invited_by_user_id=current_user.id,
        token_hash=invitation_token_hash(token),
        role=payload.role,
        status="pending",
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    db.add(invitation)

    invited_user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if invited_user:
        existing_member = db.scalar(
            select(RoomMember).where(RoomMember.room_id == room_id, RoomMember.user_id == invited_user.id)
        )
        if not existing_member:
            db.add(RoomMember(room_id=room_id, user_id=invited_user.id, role=payload.role))

    db.commit()
    db.refresh(invitation)
    email_sent, email_error = send_invitation_email(invitation, room, current_user, token)
    return invitation_out(invitation, token, email_sent=email_sent, email_error=email_error)


@router.delete("/api/rooms/{room_id}/invitations/{invitation_id}", response_model=InvitationOut)
def revoke_invitation(
    room_id: str,
    invitation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InvitationOut:
    ensure_room_admin(db, room_id, current_user.id)
    invitation = db.scalar(
        select(RoomInvitation).where(RoomInvitation.id == invitation_id, RoomInvitation.room_id == room_id)
    )
    if not invitation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")
    refresh_invitation_status(invitation)
    if invitation.status == "accepted":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Accepted invitation cannot be revoked")
    invitation.status = "revoked"
    db.commit()
    db.refresh(invitation)
    return invitation_out(invitation)


@router.post("/api/invitations/{token}/accept", response_model=InvitationAcceptOut)
def accept_invitation(
    token: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> InvitationAcceptOut:
    invitation = db.scalar(select(RoomInvitation).where(RoomInvitation.token_hash == invitation_token_hash(token)))
    if not invitation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")
    if invitation.status not in {"pending", "accepted"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invitation is not active")
    if aware_datetime(invitation.expires_at) < datetime.now(timezone.utc):
        invitation.status = "expired"
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invitation expired")
    if invitation.invited_email.lower() != current_user.email.lower():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invitation email mismatch")

    existing_member = db.scalar(
        select(RoomMember).where(RoomMember.room_id == invitation.room_id, RoomMember.user_id == current_user.id)
    )
    if not existing_member:
        db.add(RoomMember(room_id=invitation.room_id, user_id=current_user.id, role=invitation.role))
    invitation.status = "accepted"
    invitation.accepted_at = datetime.now(timezone.utc)
    db.commit()
    room = db.scalar(select(Room).where(Room.id == invitation.room_id))
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return InvitationAcceptOut(room=room_out(room, db, current_user), status=invitation.status)
