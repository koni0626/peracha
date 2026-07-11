from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import RoomMember, User
from ..permissions import count_room_owners, ensure_room_admin, ensure_room_member, ensure_room_owner_action
from ..room_serializers import room_member_out, room_out
from ..room_service import create_room_record, default_workspace_id_for_user, delete_room_records, get_room_or_404, rename_room
from ..room_schemas import RoomCreateIn, RoomMemberCreateIn, RoomMemberOut, RoomMemberUpdateIn, RoomOut, RoomUpdateIn
from ..schemas import PageOut
from ..security import get_current_user
from ..websocket_manager import manager


router = APIRouter(prefix="/api/rooms", tags=["rooms"])


@router.post("", response_model=RoomOut)
def create_room(
    payload: RoomCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RoomOut:
    workspace_id = payload.workspace_id
    if workspace_id is None:
        workspace_id = default_workspace_id_for_user(db, current_user.id)
    if not workspace_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Workspace not found")

    room = create_room_record(db, current_user, workspace_id, payload.name, payload.description)
    db.commit()
    db.refresh(room)
    return room_out(room, db, current_user)


@router.delete("/{room_id}", response_model=RoomOut)
async def delete_room(
    room_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RoomOut:
    actor = ensure_room_member(db, room_id, current_user.id)
    if actor.role != "owner":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Room owner role required")

    room = get_room_or_404(db, room_id)
    deleted = room_out(room, db, current_user)
    await manager.publish(room_id, {"event": "room.deleted", "room_id": room_id, "data": deleted.model_dump(mode="json")})

    delete_room_records(db, room)
    db.commit()
    return deleted


@router.patch("/{room_id}", response_model=RoomOut)
async def update_room(
    room_id: str,
    payload: RoomUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RoomOut:
    ensure_room_admin(db, room_id, current_user.id)
    room = rename_room(db, room_id, payload.name)
    db.commit()
    db.refresh(room)
    output = room_out(room, db, current_user)
    await manager.publish(room_id, {"event": "room.updated", "room_id": room_id, "data": output.model_dump(mode="json")})
    return output


@router.get("/{room_id}/members", response_model=PageOut[RoomMemberOut])
def list_room_members(
    room_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[RoomMemberOut]:
    ensure_room_member(db, room_id, current_user.id)
    rows = db.execute(
        select(RoomMember, User)
        .join(User, User.id == RoomMember.user_id)
        .where(RoomMember.room_id == room_id)
        .order_by(RoomMember.joined_at)
    ).all()
    return PageOut[RoomMemberOut](items=[room_member_out(member, user) for member, user in rows])


@router.post("/{room_id}/members", response_model=RoomMemberOut)
def add_room_member(
    room_id: str,
    payload: RoomMemberCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RoomMemberOut:
    ensure_room_admin(db, room_id, current_user.id)
    user = db.scalar(select(User).where(User.id == payload.user_id, User.status == "active"))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    existing_member = db.scalar(
        select(RoomMember).where(RoomMember.room_id == room_id, RoomMember.user_id == payload.user_id)
    )
    if existing_member:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User is already a room member")

    member = RoomMember(room_id=room_id, user_id=payload.user_id, role=payload.role)
    db.add(member)
    db.commit()
    db.refresh(member)
    return room_member_out(member, user)


@router.patch("/{room_id}/members/{member_id}", response_model=RoomMemberOut)
def update_room_member(
    room_id: str,
    member_id: str,
    payload: RoomMemberUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RoomMemberOut:
    actor = ensure_room_admin(db, room_id, current_user.id)
    row = db.execute(
        select(RoomMember, User)
        .join(User, User.id == RoomMember.user_id)
        .where(RoomMember.id == member_id, RoomMember.room_id == room_id)
    ).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room member not found")
    member, user = row
    ensure_room_owner_action(actor, member, payload.role)
    if member.role == "owner" and payload.role != "owner" and count_room_owners(db, room_id) <= 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Room must keep at least one owner")
    member.role = payload.role
    db.commit()
    db.refresh(member)
    return room_member_out(member, user)


@router.delete("/{room_id}/members/{member_id}", response_model=RoomMemberOut)
def remove_room_member(
    room_id: str,
    member_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> RoomMemberOut:
    actor = ensure_room_admin(db, room_id, current_user.id)
    row = db.execute(
        select(RoomMember, User)
        .join(User, User.id == RoomMember.user_id)
        .where(RoomMember.id == member_id, RoomMember.room_id == room_id)
    ).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room member not found")
    member, user = row
    ensure_room_owner_action(actor, member)
    if member.role == "owner" and count_room_owners(db, room_id) <= 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Room must keep at least one owner")
    removed = room_member_out(member, user)
    db.delete(member)
    db.commit()
    return removed
