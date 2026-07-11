from datetime import datetime

from pydantic import BaseModel, Field

from .chat_schemas import AttachmentIn


class WorkRequestIn(BaseModel):
    room_id: str
    title: str = Field(min_length=1, max_length=240)
    body: str = Field(min_length=1, max_length=5000)
    assignee: str | None = Field(default=None, max_length=120)
    due_date: datetime | None = None
    completion_condition: str | None = Field(default=None, max_length=2000)
    create_task: bool = True
    diagnose_before_post: bool = False
    attachments: list[AttachmentIn] = []
    metadata: dict | None = None


class WorkRequestOut(BaseModel):
    message_id: str
    diagnosis_id: str | None
    task_id: str | None
    status: str
