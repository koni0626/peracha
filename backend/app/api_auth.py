import hmac
import json
from dataclasses import dataclass
from datetime import datetime, timezone

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .api_security import api_token_hash
from .config import settings
from .database import get_db
from .models import ApiClient, ApiToken, AuditLog
from .rate_limits import enforce_api_rate_limit
from .serializer_utils import json_list


@dataclass
class ApiAuthContext:
    client: ApiClient | None
    token: ApiToken | None
    scopes: set[str]
    legacy: bool = False


def aware_datetime(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def require_api_token(
    authorization: str | None = Header(default=None),
) -> ApiAuthContext:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token required")
    token = authorization.removeprefix("Bearer ").strip()
    if not hmac.compare_digest(token, settings.api_token_secret):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API token")
    return ApiAuthContext(client=None, token=None, scopes={"*"}, legacy=True)


def get_api_auth_context(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> ApiAuthContext:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token required")
    bearer_token = authorization.removeprefix("Bearer ").strip()

    if hmac.compare_digest(bearer_token, settings.api_token_secret):
        auth = ApiAuthContext(client=None, token=None, scopes={"*"}, legacy=True)
        enforce_api_rate_limit("legacy")
        return auth

    token_hash = api_token_hash(bearer_token)
    api_token = db.scalar(select(ApiToken).where(ApiToken.token_hash == token_hash))
    if not api_token or api_token.revoked_at is not None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API token")
    if api_token.expires_at and aware_datetime(api_token.expires_at) < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="API token expired")
    client = db.scalar(select(ApiClient).where(ApiClient.id == api_token.api_client_id))
    if not client or client.active != "true":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="API client inactive")
    api_token.last_used_at = datetime.now(timezone.utc)
    db.flush()
    auth = ApiAuthContext(client=client, token=api_token, scopes=set(json_list(client.scopes_json)))
    enforce_api_rate_limit(api_token.id)
    return auth


def ensure_api_scope(auth: ApiAuthContext, required_scope: str) -> None:
    if "*" in auth.scopes or required_scope in auth.scopes:
        return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Missing API scope: {required_scope}")


def ensure_api_room_access(auth: ApiAuthContext, room_id: str | None) -> None:
    if auth.client and auth.client.room_id and room_id and auth.client.room_id != room_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="API client cannot access this room")


def record_audit_log(
    db: Session,
    auth: ApiAuthContext,
    action: str,
    method: str,
    path: str,
    room_id: str | None = None,
    resource_type: str | None = None,
    resource_id: str | None = None,
    metadata: dict | None = None,
) -> None:
    db.add(
        AuditLog(
            api_client_id=auth.client.id if auth.client else None,
            api_token_id=auth.token.id if auth.token else None,
            room_id=room_id,
            actor_type="legacy_token" if auth.legacy else "api_client",
            action=action,
            method=method,
            path=path,
            resource_type=resource_type,
            resource_id=resource_id,
            metadata_json=json.dumps(metadata, ensure_ascii=False) if metadata else None,
        )
    )
