from datetime import datetime

from pydantic import BaseModel, Field


class CareCreateIn(BaseModel):
    room_id: str
    message_ids: list[str] | None = None
    trigger: str = "manual"


class CareOut(BaseModel):
    id: str
    room_id: str
    care_type: str
    emotional_summary: str | None
    issue_summary: str
    fact_check_points: list[str]
    decision_criteria: list[str]
    facilitator_reply: str
    suggest_board: bool
    created_at: datetime


class TaskCreateIn(BaseModel):
    room_id: str | None = None
    diagnosis_id: str | None = None
    room_message_id: str | None = None
    title: str = Field(min_length=1, max_length=240)
    assignee: str | None = Field(default=None, max_length=120)
    due_date: datetime | None = None
    completion_condition: str | None = Field(default=None, max_length=2000)
    metadata: dict | None = None


class TaskUpdateIn(BaseModel):
    status: str | None = Field(default=None, pattern="^(未着手|進行中|確認待ち|完了|保留)$")
    assignee: str | None = Field(default=None, max_length=120)
    due_date: datetime | None = None
    completion_condition: str | None = Field(default=None, max_length=2000)
    progress_note: str | None = Field(default=None, max_length=4000)
    result_message_id: str | None = None


class TaskOut(BaseModel):
    id: str
    room_id: str
    diagnosis_id: str | None
    room_message_id: str | None
    title: str
    assignee: str | None
    due_date: datetime | None
    status: str
    completion_condition: str | None
    progress_note: str | None
    result_message_id: str | None
    metadata: dict | None
    created_at: datetime
    updated_at: datetime
