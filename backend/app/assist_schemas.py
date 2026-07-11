from pydantic import BaseModel, Field

from .chat_schemas import RoomFileOut


class MessageRewriteIn(BaseModel):
    text: str = Field(min_length=1, max_length=5000)


class MessageRewriteOut(BaseModel):
    original_text: str
    improved_text: str
    diagnosis_id: str | None = None


class PeraichiCreateIn(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    title: str | None = Field(default=None, max_length=160)
    image_model: str | None = None


class PeraichiCreateOut(BaseModel):
    title: str
    file: RoomFileOut
