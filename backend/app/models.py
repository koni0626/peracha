from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:16]}"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("user"))
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="active", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)

    room_memberships: Mapped[list["RoomMember"]] = relationship(back_populates="user")


class Stamp(Base):
    __tablename__ = "stamps"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("stamp"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    folder_id: Mapped[str | None] = mapped_column(ForeignKey("stamp_folders.id"), index=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    image_model: Mapped[str] = mapped_column(String(80), nullable=False)
    reference_used: Mapped[str] = mapped_column(String(10), default="false", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class StampFolder(Base):
    __tablename__ = "stamp_folders"
    __table_args__ = (UniqueConstraint("user_id", "name", name="uq_stamp_folder_user_name"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("stfolder"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class Workspace(Base):
    __tablename__ = "workspaces"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("ws"))
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    plan: Mapped[str] = mapped_column(String(30), default="free", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)

    rooms: Mapped[list["Room"]] = relationship(back_populates="workspace")


class WorkspaceMember(Base):
    __tablename__ = "workspace_members"
    __table_args__ = (UniqueConstraint("workspace_id", "user_id", name="uq_workspace_user"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("wm"))
    workspace_id: Mapped[str] = mapped_column(ForeignKey("workspaces.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(30), default="owner", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("room"))
    workspace_id: Mapped[str] = mapped_column(ForeignKey("workspaces.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    created_by_user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)

    workspace: Mapped[Workspace] = relationship(back_populates="rooms")
    members: Mapped[list["RoomMember"]] = relationship(back_populates="room")
    messages: Mapped[list["RoomMessage"]] = relationship(back_populates="room")


class RoomMember(Base):
    __tablename__ = "room_members"
    __table_args__ = (UniqueConstraint("room_id", "user_id", name="uq_room_user"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("rm"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(30), default="member", nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)

    room: Mapped[Room] = relationship(back_populates="members")
    user: Mapped[User] = relationship(back_populates="room_memberships")


class RoomMessage(Base):
    __tablename__ = "room_messages"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("msg"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True, nullable=False)
    thread_id: Mapped[str | None] = mapped_column(String)
    sender_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    sender_type: Mapped[str] = mapped_column(String(30), default="user", nullable=False)
    sender_name: Mapped[str | None] = mapped_column(String(120))
    body: Mapped[str] = mapped_column(Text, nullable=False)
    url: Mapped[str | None] = mapped_column(String(500))
    metadata_json: Mapped[str | None] = mapped_column(Text)
    posted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    edited_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    room: Mapped[Room] = relationship(back_populates="messages")


class RoomReadState(Base):
    __tablename__ = "room_read_states"
    __table_args__ = (UniqueConstraint("room_id", "user_id", name="uq_room_read_user"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("read"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    last_read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class RoomInvitation(Base):
    __tablename__ = "room_invitations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("inv"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True, nullable=False)
    invited_email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    invited_by_user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    role: Mapped[str] = mapped_column(String(30), default="member", nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class RoomFile(Base):
    __tablename__ = "room_files"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("file"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True, nullable=False)
    uploaded_by_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    room_message_id: Mapped[str | None] = mapped_column(ForeignKey("room_messages.id"), index=True)
    original_name: Mapped[str] = mapped_column(String(255), nullable=False)
    stored_name: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str | None] = mapped_column(String(120))
    size_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("diag"))
    room_id: Mapped[str | None] = mapped_column(ForeignKey("rooms.id"), index=True)
    room_message_id: Mapped[str | None] = mapped_column(ForeignKey("room_messages.id"), index=True)
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    original_text: Mapped[str] = mapped_column(Text, nullable=False)
    improved_text: Mapped[str] = mapped_column(Text, nullable=False)
    message_type: Mapped[str] = mapped_column(String(40), nullable=False)
    clarity_score: Mapped[int] = mapped_column(Integer, nullable=False)
    garbage_score: Mapped[int] = mapped_column(Integer, nullable=False)
    context_confidence_score: Mapped[int] = mapped_column(Integer, nullable=False)
    facilitator_state: Mapped[str] = mapped_column(String(40), nullable=False)
    facilitator_message: Mapped[str | None] = mapped_column(Text)
    inferred_subject: Mapped[str | None] = mapped_column(Text)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String(40), default="manual", nullable=False)
    detected_terms_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    missing_items_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    related_contexts_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    dynamic_form_json: Mapped[str | None] = mapped_column(Text)
    task_candidates_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class NowHereBoard(Base):
    __tablename__ = "now_here_boards"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("board"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    image_model: Mapped[str] = mapped_column(String(80), nullable=False)
    summary_json: Mapped[str] = mapped_column(Text, nullable=False)
    prompt: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class CareIntervention(Base):
    __tablename__ = "care_interventions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("care"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True, nullable=False)
    care_type: Mapped[str] = mapped_column(String(80), nullable=False)
    emotional_summary: Mapped[str | None] = mapped_column(Text)
    issue_summary: Mapped[str] = mapped_column(Text, nullable=False)
    fact_check_points_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    decision_criteria_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    facilitator_reply: Mapped[str] = mapped_column(Text, nullable=False)
    suggest_board: Mapped[str] = mapped_column(String(10), default="false", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("task"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True, nullable=False)
    diagnosis_id: Mapped[str | None] = mapped_column(ForeignKey("diagnoses.id"), index=True)
    room_message_id: Mapped[str | None] = mapped_column(ForeignKey("room_messages.id"), index=True)
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    assignee: Mapped[str | None] = mapped_column(String(120), index=True)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(40), default="未着手", index=True, nullable=False)
    completion_condition: Mapped[str | None] = mapped_column(Text)
    progress_note: Mapped[str | None] = mapped_column(Text)
    result_message_id: Mapped[str | None] = mapped_column(ForeignKey("room_messages.id"))
    metadata_json: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class WorkTable(Base):
    __tablename__ = "work_tables"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("wtable"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    description_markdown: Mapped[str | None] = mapped_column(Text)
    created_by_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class WorkTableColumn(Base):
    __tablename__ = "work_table_columns"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("wcol"))
    table_id: Mapped[str] = mapped_column(ForeignKey("work_tables.id"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    field_type: Mapped[str] = mapped_column(String(40), default="text", nullable=False)
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    options_json: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class WorkTableRecord(Base):
    __tablename__ = "work_table_records"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("wrec"))
    table_id: Mapped[str] = mapped_column(ForeignKey("work_tables.id"), index=True, nullable=False)
    parent_record_id: Mapped[str | None] = mapped_column(ForeignKey("work_table_records.id"), index=True)
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    values_json: Mapped[str] = mapped_column(Text, default="{}", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class RoomWikiArticle(Base):
    __tablename__ = "room_wiki_articles"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("wiki"))
    room_id: Mapped[str] = mapped_column(ForeignKey("rooms.id"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body_markdown: Mapped[str] = mapped_column(Text, default="", nullable=False)
    created_by_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class ApiClient(Base):
    __tablename__ = "api_clients"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("apic"))
    room_id: Mapped[str | None] = mapped_column(ForeignKey("rooms.id"), index=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    client_type: Mapped[str] = mapped_column(String(40), default="codex", nullable=False)
    scopes_json: Mapped[str] = mapped_column(Text, nullable=False)
    active: Mapped[str] = mapped_column(String(10), default="true", nullable=False)
    created_by_user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class ApiToken(Base):
    __tablename__ = "api_tokens"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("apit"))
    api_client_id: Mapped[str] = mapped_column(ForeignKey("api_clients.id"), index=True, nullable=False)
    name: Mapped[str | None] = mapped_column(String(160))
    token_hash: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("audit"))
    api_client_id: Mapped[str | None] = mapped_column(ForeignKey("api_clients.id"), index=True)
    api_token_id: Mapped[str | None] = mapped_column(ForeignKey("api_tokens.id"), index=True)
    room_id: Mapped[str | None] = mapped_column(ForeignKey("rooms.id"), index=True)
    actor_type: Mapped[str] = mapped_column(String(40), nullable=False)
    action: Mapped[str] = mapped_column(String(120), nullable=False)
    method: Mapped[str] = mapped_column(String(12), nullable=False)
    path: Mapped[str] = mapped_column(String(500), nullable=False)
    resource_type: Mapped[str | None] = mapped_column(String(80))
    resource_id: Mapped[str | None] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(40), default="success", nullable=False)
    metadata_json: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class WebhookEndpoint(Base):
    __tablename__ = "webhook_endpoints"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("wh"))
    room_id: Mapped[str | None] = mapped_column(ForeignKey("rooms.id"), index=True)
    url: Mapped[str] = mapped_column(String(1000), nullable=False)
    events_json: Mapped[str] = mapped_column(Text, nullable=False)
    secret_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    active: Mapped[str] = mapped_column(String(10), default="true", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)


class IdempotencyRecord(Base):
    __tablename__ = "idempotency_records"
    __table_args__ = (UniqueConstraint("scope", "key", name="uq_idempotency_scope_key"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: new_id("idem"))
    scope: Mapped[str] = mapped_column(String(120), nullable=False)
    key: Mapped[str] = mapped_column(String(200), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(80), nullable=False)
    resource_id: Mapped[str] = mapped_column(String(120), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc, nullable=False)
