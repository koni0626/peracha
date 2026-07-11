from __future__ import annotations

from .facilitator_rules import (
    AMBIGUOUS_TERMS,
    ContextMessage,
    answer,
    contains_due_date,
    dynamic_form_for_missing_items,
    matches_ambiguous_term,
    message_type,
    related_contexts as find_related_contexts,
    requires_work_detail as needs_work_detail,
)


def diagnose_text(text: str, contexts: list[ContextMessage] | None = None, form_answers: dict[str, str] | None = None) -> dict:
    contexts = contexts or []
    normalized = text.strip()
    subject_answer = answer(form_answers, "subject", "target")
    action_answer = answer(form_answers, "expected_action", "action", "request")
    due_answer = answer(form_answers, "due", "deadline")
    completion_answer = answer(form_answers, "completion_condition", "done")
    detected_terms = [
        {"term": term, "reason": reason}
        for term, reason in AMBIGUOUS_TERMS.items()
        if matches_ambiguous_term(normalized, term)
    ]

    related_contexts = find_related_contexts(normalized, contexts)
    missing_items: list[dict[str, str]] = []
    if not subject_answer and any(term["term"] in {"あれ", "これ", "それ", "この資料", "前のやつ", "例の件"} for term in detected_terms):
        missing_items.append({"item": "対象", "description": "何の資料、案件、作業を指すかが不足しています"})
    if not action_answer and any(term["term"] in {"いい感じ", "適当", "確認お願いします"} for term in detected_terms):
        missing_items.append({"item": "期待する作業内容", "description": "修正観点、確認観点、返答形式が不足しています"})
    requires_work_detail = needs_work_detail(normalized, detected_terms)
    if requires_work_detail and not due_answer and (not contains_due_date(normalized) or "なる早" in normalized):
        missing_items.append({"item": "期限", "description": "いつまでに対応・回答してほしいかが不足しています"})
    if requires_work_detail and not completion_answer and message_type(normalized) == "依頼" and not any(word in normalized for word in ["完了", "共有", "返信", "返して", "提出"]):
        missing_items.append({"item": "完了条件", "description": "完了時に何を返せばよいかが不足しています"})

    missing_keys = {item["item"] for item in missing_items}
    clarity_score = max(10, 100 - (len(detected_terms) * 12 + len(missing_items) * 14))
    context_confidence = 75 if related_contexts else (35 if detected_terms else 60)
    if "対象" in missing_keys and not related_contexts:
        context_confidence = 25

    if context_confidence >= 70 and "対象" in missing_keys:
        facilitator_state = "needs_confirmation"
        inferred_subject = related_contexts[0]["excerpt"] if related_contexts else None
        facilitator_message = "関連しそうな過去メッセージが見つかりました。この件で合っているか確認してください。"
    elif missing_items:
        facilitator_state = "unknown" if context_confidence < 40 else "needs_confirmation"
        inferred_subject = None
        missing_summary = "、".join(item["item"] for item in missing_items)
        facilitator_message = f"不足している情報: {missing_summary}。受け手が迷わないよう、ここだけ補うと伝わりやすくなります。"
    else:
        facilitator_state = "inferred"
        inferred_subject = None
        facilitator_message = "必要な情報はおおむね揃っています。このまま送っても伝わりそうです。"

    dynamic_form = None
    if facilitator_state == "unknown":
        dynamic_form = dynamic_form_for_missing_items(missing_items)

    improved_lines = ["以下の内容について確認・対応をお願いします。", ""]
    if subject_answer:
        improved_lines.append(f"対象: {subject_answer}")
    elif "対象" in missing_keys:
        improved_lines.append("対象: 〇〇")
    else:
        improved_lines.append(f"対象: {normalized[:60]}")
    if action_answer:
        improved_lines.append(f"依頼内容: {action_answer}")
    elif "期待する作業内容" in missing_keys:
        improved_lines.append("依頼内容: 〇〇の観点で確認・修正してください。")
    else:
        improved_lines.append(f"依頼内容: {normalized}")
    if due_answer:
        improved_lines.append(f"期限: {due_answer}")
    elif "期限" in missing_keys:
        improved_lines.append("期限: 〇月〇日〇時まで")
    if completion_answer:
        improved_lines.append(f"完了条件: {completion_answer}")
    elif "完了条件" in missing_keys:
        improved_lines.append("完了条件: 対応結果をこのルームに共有してください。")

    task_candidates = []
    if message_type(normalized) == "依頼":
        task_candidates.append(
            {
                "title": "依頼内容の確認・対応",
                "assignee": None,
                "due_date": None,
                "completion_condition": "対応結果をルームに共有する",
            }
        )

    reason = "、".join(item["item"] for item in missing_items) if missing_items else "必要情報が揃っています"
    return {
        "original_text": normalized,
        "improved_text": "\n".join(improved_lines),
        "message_type": message_type(normalized),
        "clarity_score": clarity_score,
        "garbage_score": 100 - clarity_score,
        "context_confidence_score": context_confidence,
        "facilitator_state": facilitator_state,
        "facilitator_message": facilitator_message,
        "inferred_subject": inferred_subject,
        "reason": f"検出結果: {reason}",
        "detected_terms": detected_terms,
        "missing_items": missing_items,
        "related_contexts": related_contexts,
        "dynamic_form": dynamic_form,
        "task_candidates": task_candidates,
    }
