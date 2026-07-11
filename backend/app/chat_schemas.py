from datetime import datetime

from pydantic import BaseModel, Field


class AttachmentIn(BaseModel):
    title: str = Field(min_length=1, max_length=240)
    url: str = Field(min_length=1, max_length=1000)
    content_type: str | None = Field(default=None, max_length=120)
    size_bytes: int | None = Field(default=None, ge=0)
    description: str | None = Field(default=None, max_length=1000)


class AttachmentOut(BaseModel):
    title: str
    url: str
    content_type: str | None = None
    size_bytes: int | None = None
    description: str | None = None


class StampUseIn(BaseModel):
    id: str = Field(min_length=1, max_length=120)
    title: str = Field(min_length=1, max_length=160)
    image_url: str = Field(min_length=1, max_length=4000)


class MessageCreateIn(BaseModel):
    body: str = Field(min_length=1, max_length=5000)
    thread_id: str | None = None
    reply_to_message_id: str | None = Field(default=None, max_length=120)
    diagnose_after_post: bool = False
    sender_name: str | None = Field(default=None, max_length=120)
    sender_type: str | None = Field(default=None, pattern="^(user|agent|facilitator|system)$")
    attachments: list[AttachmentIn] = []
    stamps: list[StampUseIn] = []
    metadata: dict | None = None


class RoomFileOut(BaseModel):
    id: str
    room_id: str
    original_name: str
    content_type: str | None
    size_bytes: int
    download_url: str
    preview_url: str | None = None
    preview_kind: str
    created_at: datetime


class RoomFilePreviewOut(BaseModel):
    file_id: str
    preview_kind: str
    text: str
    truncated: bool = False


class MessageOut(BaseModel):
    id: str
    room_id: str
    sender_user_id: str | None = None
    sender_type: str
    sender_name: str | None
    sender_avatar_url: str | None = None
    body: str
    thread_id: str | None
    reply_to: dict | None = None
    thread_reply_count: int = 0
    attachments: list[AttachmentOut] = []
    stamps: list[StampUseIn] = []
    metadata: dict | None = None
    read_status: str = "未読"
    read_count: int = 0
    created_at: datetime


class RoomReadStateUpdateIn(BaseModel):
    message_id: str | None = Field(default=None, max_length=120)
