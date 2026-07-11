from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    avatar_url: str | None = None


class RoomCreateIn(BaseModel):
    workspace_id: str | None = None
    name: str = Field(min_length=1, max_length=160)
    description: str | None = Field(default=None, max_length=2000)


class RoomUpdateIn(BaseModel):
    name: str = Field(min_length=1, max_length=160)


class RoomOut(BaseModel):
    id: str
    workspace_id: str
    workspace_name: str | None = None
    name: str
    description: str | None
    unread_count: int = 0
    created_at: datetime


class RoomMemberOut(BaseModel):
    id: str
    room_id: str
    user: UserOut
    role: str
    joined_at: datetime


class RoomMemberCreateIn(BaseModel):
    user_id: str = Field(min_length=1, max_length=120)
    role: str = Field(default="member", pattern="^(admin|member|guest)$")


class RoomMemberUpdateIn(BaseModel):
    role: str = Field(pattern="^(owner|admin|member|guest)$")


class InvitationCreateIn(BaseModel):
    email: EmailStr
    role: str = Field(default="member", pattern="^(admin|member|guest)$")


class InvitationOut(BaseModel):
    id: str
    room_id: str
    invited_email: EmailStr
    role: str
    status: str
    token: str | None = None
    accept_url: str | None = None
    email_sent: bool = False
    email_error: str | None = None
    expires_at: datetime
    created_at: datetime


class InvitationAcceptOut(BaseModel):
    room: RoomOut
    status: str
