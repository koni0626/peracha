import time
from collections import defaultdict, deque

from fastapi import HTTPException, status

from .config import settings

api_rate_windows: dict[str, deque[float]] = defaultdict(deque)
message_post_rate_windows: dict[str, deque[float]] = defaultdict(deque)
websocket_typing_windows: dict[str, deque[float]] = defaultdict(deque)


def enforce_api_rate_limit(identity: str) -> None:
    limit = settings.api_rate_limit_per_minute
    if limit <= 0:
        return
    now = time.monotonic()
    window = api_rate_windows[identity]
    while window and now - window[0] >= 60:
        window.popleft()
    if len(window) >= limit:
        retry_after = max(1, int(60 - (now - window[0])))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="API rate limit exceeded",
            headers={"Retry-After": str(retry_after)},
        )
    window.append(now)


def enforce_message_post_rate_limit(identity: str) -> None:
    limit = settings.message_post_rate_limit_per_minute
    if limit <= 0:
        return
    now = time.monotonic()
    window = message_post_rate_windows[identity]
    while window and now - window[0] >= 60:
        window.popleft()
    if len(window) >= limit:
        retry_after = max(1, int(60 - (now - window[0])))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Message post rate limit exceeded",
            headers={"Retry-After": str(retry_after)},
        )
    window.append(now)


def allow_websocket_typing_event(identity: str) -> bool:
    limit = settings.websocket_typing_rate_limit_per_minute
    if limit <= 0:
        return True
    now = time.monotonic()
    window = websocket_typing_windows[identity]
    while window and now - window[0] >= 60:
        window.popleft()
    if len(window) >= limit:
        return False
    window.append(now)
    return True
