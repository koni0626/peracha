from datetime import datetime

from pydantic import BaseModel, Field


class WikiArticleCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    body_markdown: str = Field(default="", max_length=50000)


class WikiArticleUpdateIn(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    body_markdown: str | None = Field(default=None, max_length=50000)


class WikiArticleOut(BaseModel):
    id: str
    room_id: str
    title: str
    body_markdown: str
    created_by_user_id: str | None
    created_at: datetime
    updated_at: datetime
