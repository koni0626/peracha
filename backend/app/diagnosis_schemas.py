from datetime import datetime

from pydantic import BaseModel, Field


class DetectedTermOut(BaseModel):
    term: str
    reason: str


class MissingItemOut(BaseModel):
    item: str
    description: str


class RelatedContextOut(BaseModel):
    id: str
    type: str
    title: str
    excerpt: str
    url: str | None = None
    confidence: float


class DynamicFormFieldOut(BaseModel):
    id: str
    label: str
    type: str
    required: bool = True
    options: list[str] = []


class TaskCandidateOut(BaseModel):
    title: str
    assignee: str | None = None
    due_date: str | None = None
    completion_condition: str | None = None


class DiagnosisCreateIn(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    source: str = "manual"
    room_id: str | None = None
    room_message_id: str | None = None
    selected_context_id: str | None = None
    form_answers: dict[str, str] | None = None


class DiagnosisOut(BaseModel):
    id: str
    room_id: str | None
    room_message_id: str | None
    original_text: str
    improved_text: str
    message_type: str
    clarity_score: int
    garbage_score: int
    context_confidence_score: int
    facilitator_state: str
    facilitator_message: str | None
    inferred_subject: str | None
    reason: str
    detected_terms: list[DetectedTermOut]
    missing_items: list[MissingItemOut]
    related_contexts: list[RelatedContextOut]
    dynamic_form: list[DynamicFormFieldOut] | None
    task_candidates: list[TaskCandidateOut]
    created_at: datetime
