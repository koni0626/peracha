import json
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from ..api_security import api_token_hash
from ..database import get_db
from ..models import ApiClient, ApiToken, AuditLog, RoomMember, User, WorkspaceMember
from ..permissions import ensure_room_admin
from ..api_integration_schemas import ApiClientCreateIn, ApiClientOut, ApiTokenCreateIn, ApiTokenOut, AuditLogOut
from ..schemas import PageOut
from ..security import get_current_user
from ..api_serializers import api_client_out, api_token_out, audit_log_out

router = APIRouter(prefix="/api", tags=["api-clients"])


def ensure_api_client_owner_or_admin(db: Session, client: ApiClient, current_user: User) -> None:
    if client.room_id:
        ensure_room_admin(db, client.room_id, current_user.id)
        return
    if client.created_by_user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="API client access denied")


@router.post("/api-clients", response_model=ApiClientOut)
def create_api_client(
    payload: ApiClientCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiClientOut:
    if payload.room_id:
        ensure_room_admin(db, payload.room_id, current_user.id)
    else:
        workspace_role = db.scalar(select(WorkspaceMember.role).where(WorkspaceMember.user_id == current_user.id))
        if workspace_role not in {"owner", "admin"}:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Workspace admin role required")
    client = ApiClient(
        room_id=payload.room_id,
        name=payload.name,
        client_type=payload.client_type,
        scopes_json=json.dumps(payload.scopes, ensure_ascii=False),
        active="true" if payload.active else "false",
        created_by_user_id=current_user.id,
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return api_client_out(client)


@router.get("/api-clients", response_model=PageOut[ApiClientOut])
def list_api_clients(
    room_id: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[ApiClientOut]:
    if room_id:
        ensure_room_admin(db, room_id, current_user.id)
        stmt = select(ApiClient).where(ApiClient.room_id == room_id)
    else:
        admin_room_ids = db.scalars(
            select(RoomMember.room_id).where(RoomMember.user_id == current_user.id, RoomMember.role.in_(["owner", "admin"]))
        ).all()
        stmt = select(ApiClient).where((ApiClient.room_id.in_(admin_room_ids)) | (ApiClient.created_by_user_id == current_user.id))
    clients = db.scalars(stmt.order_by(desc(ApiClient.created_at))).all()
    return PageOut[ApiClientOut](items=[api_client_out(client) for client in clients])


@router.post("/api-clients/{client_id}/tokens", response_model=ApiTokenOut)
def create_api_token(
    client_id: str,
    payload: ApiTokenCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiTokenOut:
    client = db.scalar(select(ApiClient).where(ApiClient.id == client_id))
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="API client not found")
    ensure_api_client_owner_or_admin(db, client, current_user)
    plain_token = f"sap_{secrets.token_urlsafe(32)}"
    api_token = ApiToken(
        api_client_id=client.id,
        name=payload.name,
        token_hash=api_token_hash(plain_token),
        expires_at=payload.expires_at,
    )
    db.add(api_token)
    db.commit()
    db.refresh(api_token)
    return api_token_out(api_token, plain_token=plain_token)


@router.get("/api-clients/{client_id}/tokens", response_model=PageOut[ApiTokenOut])
def list_api_tokens(
    client_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[ApiTokenOut]:
    client = db.scalar(select(ApiClient).where(ApiClient.id == client_id))
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="API client not found")
    ensure_api_client_owner_or_admin(db, client, current_user)
    tokens = db.scalars(select(ApiToken).where(ApiToken.api_client_id == client_id).order_by(desc(ApiToken.created_at))).all()
    return PageOut[ApiTokenOut](items=[api_token_out(token) for token in tokens])


@router.delete("/api-clients/{client_id}/tokens/{token_id}", response_model=ApiTokenOut)
def revoke_api_token(
    client_id: str,
    token_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApiTokenOut:
    client = db.scalar(select(ApiClient).where(ApiClient.id == client_id))
    token = db.scalar(select(ApiToken).where(ApiToken.id == token_id, ApiToken.api_client_id == client_id))
    if not client or not token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="API token not found")
    ensure_api_client_owner_or_admin(db, client, current_user)
    token.revoked_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(token)
    return api_token_out(token)


@router.get("/audit-logs", response_model=PageOut[AuditLogOut])
def list_audit_logs(
    room_id: str | None = None,
    limit: int = Query(default=50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[AuditLogOut]:
    if room_id:
        ensure_room_admin(db, room_id, current_user.id)
        stmt = select(AuditLog).where(AuditLog.room_id == room_id)
    else:
        admin_room_ids = db.scalars(
            select(RoomMember.room_id).where(RoomMember.user_id == current_user.id, RoomMember.role.in_(["owner", "admin"]))
        ).all()
        stmt = select(AuditLog).where((AuditLog.room_id.in_(admin_room_ids)) | (AuditLog.room_id.is_(None)))
    logs = db.scalars(stmt.order_by(desc(AuditLog.created_at)).limit(limit)).all()
    return PageOut[AuditLogOut](items=[audit_log_out(log) for log in logs])
