from datetime import datetime

from pydantic import BaseModel, Field


class StampOut(BaseModel):
    id: str
    folder_id: str | None = None
    title: str
    prompt: str
    image_url: str
    image_model: str
    reference_used: bool = False
    created_at: datetime


class StampFolderCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class StampFolderOut(BaseModel):
    id: str
    name: str
    stamp_count: int = 0
    created_at: datetime
