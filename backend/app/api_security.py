import hmac
import hashlib

from .config import settings


def api_token_hash(token: str) -> str:
    return hmac.new(settings.api_token_secret.encode("utf-8"), token.encode("utf-8"), hashlib.sha256).hexdigest()


def webhook_secret_hash(secret: str) -> str:
    return hmac.new(settings.webhook_signing_secret.encode("utf-8"), secret.encode("utf-8"), hashlib.sha256).hexdigest()
