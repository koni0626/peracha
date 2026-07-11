import base64
import html

from .ai_client import summarize_board_with_openai
from .chat_service import message_text_with_attachments
from .message_serializers import message_metadata
from .models import Room, RoomMessage


def summarize_board(room: Room, messages: list[RoomMessage]) -> dict:
    message_dicts = [
        {
            "id": message.id,
            "sender_name": message.sender_name,
            "sender_type": message.sender_type,
            "body": message_text_with_attachments(message),
            "attachments": message_metadata(message).get("attachments", []),
            "created_at": message.created_at.isoformat(),
        }
        for message in messages
    ]
    ai_summary = summarize_board_with_openai(room.name, message_dicts)
    if ai_summary:
        return ai_summary

    message_texts = [(message, message_text_with_attachments(message)) for message in messages]
    key_points = [text[:80] for message, text in message_texts[-4:] if message.sender_type != "facilitator"]
    decisions = [text[:80] for _, text in message_texts if any(word in text for word in ["決定", "でいきます", "確定"])]
    next_actions = [text[:80] for _, text in message_texts if any(word in text for word in ["お願いします", "対応", "作成", "確認"])]
    open_questions = [text[:80] for _, text in message_texts if "?" in text or "？" in text or "どう" in text]
    return {
        "title": f"{room.name} の今ここ",
        "key_points": key_points[:5] or ["直近の会話を整理中"],
        "decisions": decisions[:3],
        "open_questions": open_questions[:3],
        "next_actions": next_actions[:4],
        "risks": ["曖昧な依頼は、対象・期限・完了条件を補う必要があります"],
    }


def create_board_svg(summary: dict) -> str:
    title = html.escape(str(summary.get("title", "今ここボード")))
    sections = [
        ("重要論点", summary.get("key_points", [])),
        ("決定事項", summary.get("decisions", [])),
        ("未決事項", summary.get("open_questions", [])),
        ("次アクション", summary.get("next_actions", [])),
        ("放置リスク", summary.get("risks", [])),
    ]
    y = 92
    rows: list[str] = [
        "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='820' viewBox='0 0 1200 820'>",
        "<rect width='1200' height='820' fill='#f3f7f8'/>",
        "<rect x='42' y='36' width='1116' height='748' rx='18' fill='#ffffff' stroke='#d7e0e5'/>",
        f"<text x='78' y='82' font-size='34' font-family='Arial, sans-serif' font-weight='700' fill='#172026'>{title}</text>",
    ]
    colors = ["#0f8f8c", "#47626d", "#7a4f9a", "#2f7d4f", "#b42318"]
    for index, (heading, items) in enumerate(sections):
        rows.append(f"<text x='78' y='{y}' font-size='23' font-family='Arial, sans-serif' font-weight='700' fill='{colors[index]}'>{heading}</text>")
        y += 34
        safe_items = items if isinstance(items, list) else []
        if not safe_items:
            safe_items = ["該当なし"]
        for item in safe_items[:4]:
            escaped = html.escape(str(item))
            rows.append(f"<text x='96' y='{y}' font-size='20' font-family='Arial, sans-serif' fill='#172026'>- {escaped}</text>")
            y += 29
        y += 22
    rows.append("<text x='78' y='760' font-size='18' font-family='Arial, sans-serif' fill='#60707b'>Powered by BLAS / ペラチャ</text>")
    rows.append("</svg>")
    svg = "".join(rows)
    encoded = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"
