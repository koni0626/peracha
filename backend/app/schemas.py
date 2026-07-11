from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from .api_integration_schemas import (
    ApiClientCreateIn,
    ApiClientOut,
    ApiTokenCreateIn,
    ApiTokenOut,
    AuditLogOut,
    WebhookCreateIn,
    WebhookOut,
)
from .assist_schemas import MessageRewriteIn, MessageRewriteOut, PeraichiCreateIn, PeraichiCreateOut
from .board_schemas import BoardCreateIn, BoardOut, BoardSuggestionOut
from .chat_schemas import (
    AttachmentIn,
    AttachmentOut,
    MessageCreateIn,
    MessageOut,
    RoomFileOut,
    RoomFilePreviewOut,
    RoomReadStateUpdateIn,
    StampUseIn,
)
from .diagnosis_schemas import (
    DetectedTermOut,
    DiagnosisCreateIn,
    DiagnosisOut,
    DynamicFormFieldOut,
    MissingItemOut,
    RelatedContextOut,
    TaskCandidateOut,
)
from .room_schemas import (
    InvitationAcceptOut,
    InvitationCreateIn,
    InvitationOut,
    RoomCreateIn,
    RoomMemberCreateIn,
    RoomMemberOut,
    RoomMemberUpdateIn,
    RoomOut,
    RoomUpdateIn,
    UserOut,
)
from .stamp_schemas import StampFolderCreateIn, StampFolderOut, StampOut
from .task_schemas import CareCreateIn, CareOut, TaskCreateIn, TaskOut, TaskUpdateIn
from .work_table_schemas import (
    WorkTableCellValue,
    WorkTableColumnCreateIn,
    WorkTableColumnOrderIn,
    WorkTableColumnOut,
    WorkTableColumnUpdateIn,
    WorkTableCreateIn,
    WorkTableOrderIn,
    WorkTableOut,
    WorkTableRecordCreateIn,
    WorkTableRecordOrderIn,
    WorkTableRecordOut,
    WorkTableRecordUpdateIn,
    WorkTableUpdateIn,
)
from .work_request_schemas import WorkRequestIn, WorkRequestOut
from .wiki_schemas import WikiArticleCreateIn, WikiArticleOut, WikiArticleUpdateIn


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class HealthOut(BaseModel):
    status: str
    service: str
    timestamp: datetime


class PageOut[T](BaseModel):
    items: list[T]
    next_cursor: str | None = None


class MeOut(BaseModel):
    user: UserOut
    rooms: list[RoomOut]
