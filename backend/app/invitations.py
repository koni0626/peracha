import hashlib
import hmac
import smtplib
from datetime import datetime, timezone
from email.message import EmailMessage

from .config import settings
from .models import Room, RoomInvitation, User


def aware_datetime(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def invitation_token_hash(token: str) -> str:
    return hmac.new(settings.invitation_token_secret.encode("utf-8"), token.encode("utf-8"), hashlib.sha256).hexdigest()


def refresh_invitation_status(invitation: RoomInvitation) -> None:
    if invitation.status == "pending" and aware_datetime(invitation.expires_at) < datetime.now(timezone.utc):
        invitation.status = "expired"


def send_invitation_email(invitation: RoomInvitation, room: Room, inviter: User, token: str) -> tuple[bool, str | None]:
    if not settings.smtp_host or not settings.smtp_from:
        return False, None

    accept_url = f"{settings.frontend_origin}/?invite_token={token}"
    message = EmailMessage()
    message["Subject"] = f"ペラチャ: {room.name} への招待"
    message["From"] = settings.smtp_from
    message["To"] = invitation.invited_email
    message.set_content(
        "\n".join(
            [
                f"{inviter.name} さんから ペラチャ のルーム「{room.name}」へ招待されました。",
                "",
                "以下のURLを開いてログインまたは登録し、招待トークンで参加してください。",
                accept_url,
                "",
                f"招待トークン: {token}",
                f"有効期限: {invitation.expires_at.isoformat()}",
            ]
        )
    )

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()
            if settings.smtp_username and settings.smtp_password:
                smtp.login(settings.smtp_username, settings.smtp_password)
            smtp.send_message(message)
    except Exception as exc:
        return False, str(exc)
    return True, None
