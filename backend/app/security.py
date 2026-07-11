import base64
import hashlib
import hmac
import json
from typing import Any

from fastapi import Cookie, Depends, HTTPException, Response, WebSocket, status
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db
from .models import User


pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
SESSION_COOKIE = "sapiens_session"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def _sign(payload: bytes) -> str:
    return hmac.new(settings.session_secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()


def create_session_token(user_id: str) -> str:
    payload = json.dumps({"user_id": user_id}, separators=(",", ":")).encode("utf-8")
    body = base64.urlsafe_b64encode(payload).decode("ascii")
    return f"{body}.{_sign(payload)}"


def read_session_token(token: str | None) -> dict[str, Any] | None:
    if not token or "." not in token:
        return None
    body, signature = token.rsplit(".", 1)
    try:
        payload = base64.urlsafe_b64decode(body.encode("ascii"))
    except Exception:
        return None
    if not hmac.compare_digest(_sign(payload), signature):
        return None
    return json.loads(payload)


def set_session_cookie(response: Response, user_id: str) -> None:
    response.set_cookie(
        SESSION_COOKIE,
        create_session_token(user_id),
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 30,
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(SESSION_COOKIE, samesite="lax", secure=False)


def get_current_user(
    session_token: str | None = Cookie(default=None, alias=SESSION_COOKIE),
    db: Session = Depends(get_db),
) -> User:
    payload = read_session_token(session_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    user = db.scalar(select(User).where(User.id == payload["user_id"]))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user


async def get_websocket_user(websocket: WebSocket, db: Session) -> User | None:
    payload = read_session_token(websocket.cookies.get(SESSION_COOKIE))
    if not payload:
        return None
    return db.scalar(select(User).where(User.id == payload["user_id"]))
