from datetime import datetime

from pydantic import BaseModel


class BoardCreateIn(BaseModel):
    room_id: str
    message_ids: list[str] | None = None
    trigger: str = "manual"
    image_model: str | None = None


class BoardOut(BaseModel):
    id: str
    room_id: str
    title: str
    image_url: str
    image_model: str
    summary_json: dict
    created_at: datetime


class BoardSuggestionOut(BaseModel):
    room_id: str
    trigger: str
    reason: str
    message_ids: list[str]
    suggested_at: datetime
