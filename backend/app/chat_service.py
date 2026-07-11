from datetime import datetime

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from .message_serializers import message_metadata, metadata_with_attachments
from .models import RoomMember, RoomMessage, Task, User
from .room_serializers import user_out
from .schemas import RelatedContextOut


def room_mentions_metadata(db: Session, room_id: str, text: str, sender_user_id: str | None = None) -> dict:
    lowered = text.lower()
    mention_all = any(token in lowered for token in ("@all", "@here", "@channel"))
    rows = db.execute(
        select(User)
        .join(RoomMember, RoomMember.user_id == User.id)
        .where(RoomMember.room_id == room_id, User.status == "active")
        .order_by(User.name)
    ).scalars().all()
    mentions = []
    for user in rows:
        if user.id == sender_user_id:
            continue
        aliases = {user.name.strip(), user.email.strip(), user.email.split("@", 1)[0].strip()}
        if any(alias and f"@{alias.lower()}" in lowered for alias in aliases):
            mentions.append(user_out(user).model_dump(mode="json"))
    metadata: dict = {}
    if mentions:
        metadata["mentions"] = mentions
    if mention_all:
        metadata["mention_all"] = True
    return metadata


def metadata_for_message(
    db: Session,
    room_id: str,
    text: str,
    sender_user_id: str | None,
    metadata: dict | None,
    attachments: list,
    stamps: list | None = None,
) -> str | None:
    merged = dict(metadata or {})
    merged.update(room_mentions_metadata(db, room_id, text, sender_user_id))
    return metadata_with_attachments(merged, attachments, stamps)


def message_text_with_attachments(message: RoomMessage) -> str:
    attachments = message_metadata(message).get("attachments", [])
    if not attachments:
        return message.body
    attachment_lines = [
        f"- {item.get('title')}: {item.get('url')}"
        for item in attachments
        if isinstance(item, dict)
    ]
    if not attachment_lines:
        return message.body
    return f"{message.body}\n\n添付資料:\n" + "\n".join(attachment_lines)


def context_search_terms(query: str) -> list[str]:
    normalized = query.strip().lower()
    if not normalized:
        return []
    terms = [term for term in normalized.replace("　", " ").split(" ") if term]
    if normalized not in terms:
        terms.insert(0, normalized)
    return terms


def context_match_score(query: str, text: str) -> float:
    normalized_query = query.strip().lower()
    normalized_text = text.lower()
    if not normalized_query:
        return 0.25
    score = 0.0
    if normalized_query in normalized_text:
        score += 0.55
    for term in context_search_terms(query):
        if term in normalized_text:
            score += 0.2
    return min(score, 0.99)


def search_room_contexts(db: Session, room_id: str, query: str, limit: int) -> list[RelatedContextOut]:
    candidates: list[tuple[float, datetime, RelatedContextOut]] = []
    messages = db.scalars(
        select(RoomMessage)
        .where(RoomMessage.room_id == room_id, RoomMessage.deleted_at.is_(None))
        .order_by(desc(RoomMessage.created_at))
        .limit(200)
    ).all()
    for message in messages:
        text = message_text_with_attachments(message)
        score = context_match_score(query, text)
        if score > 0:
            candidates.append(
                (
                    score,
                    message.created_at,
                    RelatedContextOut(
                        id=message.id,
                        type="message",
                        title=f"{message.sender_name or message.sender_type} のメッセージ",
                        excerpt=text[:160],
                        url=f"/messages/{message.id}",
                        confidence=score,
                    ),
                )
            )

    tasks = db.scalars(select(Task).where(Task.room_id == room_id).order_by(desc(Task.created_at)).limit(200)).all()
    for task in tasks:
        text = " ".join(
            item
            for item in [task.title, task.assignee, task.completion_condition, task.progress_note]
            if item
        )
        score = min(context_match_score(query, text) + 0.05, 0.99)
        if score > 0.05:
            candidates.append(
                (
                    score,
                    task.created_at,
                    RelatedContextOut(
                        id=task.id,
                        type="task",
                        title=f"タスク: {task.title}",
                        excerpt=text[:160],
                        url=f"/tasks/{task.id}",
                        confidence=score,
                    ),
                )
            )

    candidates.sort(key=lambda item: (item[0], item[1]), reverse=True)
    return [candidate for _, _, candidate in candidates[:limit]]
