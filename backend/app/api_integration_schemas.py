from datetime import datetime

from pydantic import BaseModel, Field


class ApiClientCreateIn(BaseModel):
    room_id: str | None = None
    name: str = Field(min_length=1, max_length=160)
    client_type: str = Field(default="codex", pattern="^(codex|external_system|webhook|other)$")
    scopes: list[str] = Field(min_length=1)
    active: bool = True


class ApiClientOut(BaseModel):
    id: str
    room_id: str | None
    name: str
    client_type: str
    scopes: list[str]
    active: bool
    created_at: datetime
    updated_at: datetime


class ApiTokenCreateIn(BaseModel):
    name: str | None = Field(default=None, max_length=160)
    expires_at: datetime | None = None


class ApiTokenOut(BaseModel):
    id: str
    api_client_id: str
    name: str | None
    token: str | None = None
    last_used_at: datetime | None
    expires_at: datetime | None
    revoked_at: datetime | None
    created_at: datetime


class AuditLogOut(BaseModel):
    id: str
    api_client_id: str | None
    api_token_id: str | None
    room_id: str | None
    actor_type: str
    action: str
    method: str
    path: str
    resource_type: str | None
    resource_id: str | None
    status: str
    metadata: dict | None
    created_at: datetime


class WebhookCreateIn(BaseModel):
    room_id: str | None = None
    url: str = Field(min_length=1, max_length=1000)
    events: list[str] = Field(min_length=1)
    secret: str = Field(min_length=8, max_length=200)


class WebhookOut(BaseModel):
    id: str
    room_id: str | None
    url: str
    events: list[str]
    active: bool
    created_at: datetime
