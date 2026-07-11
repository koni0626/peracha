from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Room, RoomMember, User, Workspace, WorkspaceMember
from ..room_serializers import room_out, user_out
from ..schemas import LoginIn, MeOut, RegisterIn
from ..security import clear_session_cookie, get_current_user, hash_password, set_session_cookie, verify_password


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=MeOut)
def register(payload: RegisterIn, response: Response, db: Session = Depends(get_db)) -> MeOut:
    existing = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(name=payload.name, email=payload.email.lower(), password_hash=hash_password(payload.password))
    workspace = Workspace(name=f"{payload.name} のワークスペース")
    db.add_all([user, workspace])
    db.flush()

    db.add(WorkspaceMember(workspace_id=workspace.id, user_id=user.id, role="owner"))
    db.commit()
    db.refresh(user)
    set_session_cookie(response, user.id)
    return MeOut(user=user_out(user), rooms=[])


@router.post("/login", response_model=MeOut)
def login(payload: LoginIn, response: Response, db: Session = Depends(get_db)) -> MeOut:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    set_session_cookie(response, user.id)
    rooms = db.scalars(
        select(Room).join(RoomMember, RoomMember.room_id == Room.id).where(RoomMember.user_id == user.id)
    ).all()
    return MeOut(user=user_out(user), rooms=[room_out(room, db, user) for room in rooms])


@router.post("/logout")
def logout(response: Response) -> dict[str, str]:
    clear_session_cookie(response)
    return {"status": "ok"}


@router.get("/me", response_model=MeOut)
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> MeOut:
    rooms = db.scalars(
        select(Room).join(RoomMember, RoomMember.room_id == Room.id).where(RoomMember.user_id == current_user.id)
    ).all()
    return MeOut(user=user_out(current_user), rooms=[room_out(room, db, current_user) for room in rooms])
