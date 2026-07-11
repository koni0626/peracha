import json
from datetime import datetime, timezone

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from .ai_client import clarify_text_with_openai, improve_diagnosis_with_openai, proofread_text_with_openai
from .board_schemas import BoardSuggestionOut
from .chat_service import message_text_with_attachments
from .facilitator import ContextMessage, diagnose_text
from .models import Diagnosis, RoomMessage
from .serializer_utils import json_list


def board_suggestion_out(room_id: str, trigger: str, reason: str, message_ids: list[str]) -> BoardSuggestionOut:
    return BoardSuggestionOut(
        room_id=room_id,
        trigger=trigger,
        reason=reason,
        message_ids=message_ids,
        suggested_at=datetime.now(timezone.utc),
    )


def should_suggest_board_for_diagnosis(diagnosis: Diagnosis, message_body: str) -> tuple[bool, str]:
    if len(message_body) >= 240:
        return True, "会話が長くなっているため、今ここボードで現在地を整理できます。"
    if diagnosis.context_confidence_score <= 45:
        return True, "文脈の確信度が低いため、重要な論点を一度ボード化できます。"
    if diagnosis.garbage_score >= 55:
        return True, "論点が散らかっている可能性があるため、今ここボードで整理できます。"
    if json_list(diagnosis.task_candidates_json):
        return True, "タスク候補が見つかったため、決定事項と次アクションをボード化できます。"
    return False, ""


def should_publish_facilitator_message(diagnosis: Diagnosis) -> bool:
    if diagnosis.facilitator_state != "inferred":
        return True
    if json_list(diagnosis.detected_terms_json) or json_list(diagnosis.missing_items_json):
        return True
    return False


def create_diagnosis_record(
    db: Session,
    text: str,
    room_id: str | None,
    user_id: str | None,
    room_message_id: str | None,
    source: str,
    form_answers: dict[str, str] | None = None,
) -> Diagnosis:
    context_rows: list[RoomMessage] = []
    if room_id:
        context_rows = db.scalars(
            select(RoomMessage)
            .where(RoomMessage.room_id == room_id, RoomMessage.deleted_at.is_(None))
            .order_by(desc(RoomMessage.created_at))
            .limit(20)
        ).all()
    contexts = [
        ContextMessage(id=row.id, body=message_text_with_attachments(row), sender_name=row.sender_name, created_at=row.created_at)
        for row in context_rows
        if row.id != room_message_id
    ]
    result = diagnose_text(text, contexts, form_answers=form_answers)
    result = improve_diagnosis_with_openai(
        result,
        text,
        [
            {
                "id": context.id,
                "body": context.body,
                "sender_name": context.sender_name,
                "created_at": context.created_at.isoformat(),
            }
            for context in contexts
        ],
    )
    diagnosis = Diagnosis(
        room_id=room_id,
        room_message_id=room_message_id,
        user_id=user_id,
        original_text=result["original_text"],
        improved_text=result["improved_text"],
        message_type=result["message_type"],
        clarity_score=result["clarity_score"],
        garbage_score=result["garbage_score"],
        context_confidence_score=result["context_confidence_score"],
        facilitator_state=result["facilitator_state"],
        facilitator_message=result["facilitator_message"],
        inferred_subject=result["inferred_subject"],
        reason=result["reason"],
        source=source,
        detected_terms_json=json.dumps(result["detected_terms"], ensure_ascii=False),
        missing_items_json=json.dumps(result["missing_items"], ensure_ascii=False),
        related_contexts_json=json.dumps(result["related_contexts"], ensure_ascii=False),
        dynamic_form_json=json.dumps(result["dynamic_form"], ensure_ascii=False) if result["dynamic_form"] else None,
        task_candidates_json=json.dumps(result["task_candidates"], ensure_ascii=False),
    )
    db.add(diagnosis)
    db.flush()
    return diagnosis


def create_proofreading_record(
    db: Session,
    text: str,
    room_id: str | None,
    user_id: str | None,
    room_message_id: str | None,
    source: str,
) -> Diagnosis:
    result = diagnose_text(text, contexts=[])
    result["improved_text"] = proofread_text_with_openai(result["original_text"])
    result["facilitator_state"] = "inferred"
    result["facilitator_message"] = "誤字脱字を確認しました。"
    result["inferred_subject"] = None
    result["reason"] = "AI整形は誤字脱字チェックのみ実施しました"
    result["detected_terms"] = []
    result["missing_items"] = []
    result["related_contexts"] = []
    result["dynamic_form"] = None
    result["task_candidates"] = []

    diagnosis = Diagnosis(
        room_id=room_id,
        room_message_id=room_message_id,
        user_id=user_id,
        original_text=result["original_text"],
        improved_text=result["improved_text"],
        message_type=result["message_type"],
        clarity_score=result["clarity_score"],
        garbage_score=result["garbage_score"],
        context_confidence_score=result["context_confidence_score"],
        facilitator_state=result["facilitator_state"],
        facilitator_message=result["facilitator_message"],
        inferred_subject=result["inferred_subject"],
        reason=result["reason"],
        source=source,
        detected_terms_json=json.dumps(result["detected_terms"], ensure_ascii=False),
        missing_items_json=json.dumps(result["missing_items"], ensure_ascii=False),
        related_contexts_json=json.dumps(result["related_contexts"], ensure_ascii=False),
        dynamic_form_json=None,
        task_candidates_json=json.dumps(result["task_candidates"], ensure_ascii=False),
    )
    db.add(diagnosis)
    db.flush()
    return diagnosis


def create_clarity_record(
    db: Session,
    text: str,
    room_id: str | None,
    user_id: str | None,
    room_message_id: str | None,
    source: str,
) -> Diagnosis:
    result = diagnose_text(text, contexts=[])
    result["improved_text"] = clarify_text_with_openai(result["original_text"])
    result["facilitator_state"] = "inferred"
    result["facilitator_message"] = "読みやすいMarkdownに整形しました。"
    result["inferred_subject"] = None
    result["reason"] = "長文をMarkdown形式で分かりやすく整理しました"
    result["detected_terms"] = []
    result["missing_items"] = []
    result["related_contexts"] = []
    result["dynamic_form"] = None
    result["task_candidates"] = []

    diagnosis = Diagnosis(
        room_id=room_id,
        room_message_id=room_message_id,
        user_id=user_id,
        original_text=result["original_text"],
        improved_text=result["improved_text"],
        message_type=result["message_type"],
        clarity_score=result["clarity_score"],
        garbage_score=result["garbage_score"],
        context_confidence_score=result["context_confidence_score"],
        facilitator_state=result["facilitator_state"],
        facilitator_message=result["facilitator_message"],
        inferred_subject=result["inferred_subject"],
        reason=result["reason"],
        source=source,
        detected_terms_json=json.dumps(result["detected_terms"], ensure_ascii=False),
        missing_items_json=json.dumps(result["missing_items"], ensure_ascii=False),
        related_contexts_json=json.dumps(result["related_contexts"], ensure_ascii=False),
        dynamic_form_json=None,
        task_candidates_json=json.dumps(result["task_candidates"], ensure_ascii=False),
    )
    db.add(diagnosis)
    db.flush()
    return diagnosis
