import json

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .chat_schemas import MessageOut
from .models import RoomMember, RoomMessage, RoomReadState, User
from .room_serializers import user_avatar_url
from .serializer_utils import json_dict


def message_metadata(message: RoomMessage) -> dict:
    metadata = json_dict(message.metadata_json)
    attachments = metadata.get("attachments")
    if not isinstance(attachments, list):
        metadata.pop("attachments", None)
        return metadata
    metadata["attachments"] = [
        attachment
        for attachment in attachments
        if isinstance(attachment, dict) and attachment.get("title") and attachment.get("url")
    ]
    stamps = metadata.get("stamps")
    if isinstance(stamps, list):
        metadata["stamps"] = [
            stamp
            for stamp in stamps
            if isinstance(stamp, dict) and stamp.get("id") and stamp.get("title") and stamp.get("image_url")
        ]
    else:
        metadata.pop("stamps", None)
    return metadata


def metadata_with_attachments(metadata: dict | None, attachments: list, stamps: list | None = None) -> str | None:
    merged = dict(metadata or {})
    serialized_attachments = [
        attachment.model_dump(mode="json", exclude_none=True)
        for attachment in attachments
    ]
    if serialized_attachments:
        merged["attachments"] = serialized_attachments
    serialized_stamps = [
        stamp.model_dump(mode="json", exclude_none=True) if hasattr(stamp, "model_dump") else stamp
        for stamp in (stamps or [])
    ]
    if serialized_stamps:
        merged["stamps"] = serialized_stamps
    return json.dumps(merged, ensure_ascii=False) if merged else None


def message_read_status(db: Session | None, message: RoomMessage, viewer: User | None) -> tuple[str, int]:
    if not db or not viewer:
        return "未読", 0
    if message.sender_user_id == viewer.id:
        other_member_count = db.scalar(
            select(func.count()).select_from(RoomMember).where(
                RoomMember.room_id == message.room_id,
                RoomMember.user_id != viewer.id,
            )
        ) or 0
        read_count = db.scalar(
            select(func.count()).select_from(RoomReadState).where(
                RoomReadState.room_id == message.room_id,
                RoomReadState.user_id != viewer.id,
                RoomReadState.last_read_at >= message.created_at,
            )
        ) or 0
        return ("既読" if other_member_count == 0 or read_count >= other_member_count else "未読", int(read_count))

    state = db.scalar(
        select(RoomReadState).where(
            RoomReadState.room_id == message.room_id,
            RoomReadState.user_id == viewer.id,
        )
    )
    read = bool(state and state.last_read_at and state.last_read_at >= message.created_at)
    return ("既読" if read else "未読", 1 if read else 0)


def message_thread_reply_count(db: Session | None, message: RoomMessage) -> int:
    if not db:
        return 0
    return int(
        db.scalar(
            select(func.count()).select_from(RoomMessage).where(
                RoomMessage.room_id == message.room_id,
                RoomMessage.thread_id == message.id,
                RoomMessage.deleted_at.is_(None),
            )
        )
        or 0
    )


def message_out(message: RoomMessage, db: Session | None = None, viewer: User | None = None) -> MessageOut:
    metadata = message_metadata(message)
    read_status, read_count = message_read_status(db, message, viewer)
    return MessageOut(
        id=message.id,
        room_id=message.room_id,
        sender_user_id=message.sender_user_id,
        sender_type=message.sender_type,
        sender_name=message.sender_name,
        sender_avatar_url=user_avatar_url(message.sender_user_id) if message.sender_user_id else None,
        body=message.body,
        thread_id=message.thread_id,
        reply_to=metadata.get("reply_to"),
        thread_reply_count=message_thread_reply_count(db, message),
        attachments=metadata.get("attachments", []),
        stamps=metadata.get("stamps", []),
        metadata=metadata or None,
        read_status=read_status,
        read_count=read_count,
        created_at=message.created_at,
    )
