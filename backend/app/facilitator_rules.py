from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


AMBIGUOUS_TERMS: dict[str, str] = {
    "あれ": "指示語だけでは対象が特定できません",
    "これ": "指示語だけでは対象が特定できません",
    "それ": "指示語だけでは対象が特定できません",
    "この資料": "対象資料が特定できません",
    "前のやつ": "参照している過去情報が曖昧です",
    "例の件": "案件名や対象が明示されていません",
    "いい感じ": "期待する修正内容や判断基準が不明確です",
    "適当": "品質基準や完了条件が不明確です",
    "なる早": "期限が具体的ではありません",
    "確認お願いします": "何を確認してほしいか、期待する返答が曖昧です",
}

FORM_FIELD_DEFINITIONS = {
    "対象": {"id": "subject", "label": "対象は何ですか？", "type": "text", "required": True, "options": []},
    "期待する作業内容": {"id": "expected_action", "label": "何をしてほしいですか？", "type": "text", "required": True, "options": []},
    "期限": {"id": "due", "label": "期限はいつですか？", "type": "text", "required": True, "options": []},
    "完了条件": {"id": "completion_condition", "label": "完了時に何が返ってくればよいですか？", "type": "text", "required": True, "options": []},
}


@dataclass
class ContextMessage:
    id: str
    body: str
    sender_name: str | None
    created_at: datetime


def contains_due_date(text: str) -> bool:
    due_words = ["今日", "明日", "今週", "来週", "月", "日", "時", "まで", "午前", "午後"]
    return any(word in text for word in due_words)


def message_type(text: str) -> str:
    if any(word in text for word in ["お願いします", "してください", "対応", "作成", "修正"]):
        return "依頼"
    if "?" in text or "？" in text or "どう" in text:
        return "質問"
    if any(word in text for word in ["完了", "共有", "報告"]):
        return "報告"
    return "共有"


def requires_work_detail(text: str, detected_terms: list[dict[str, str]]) -> bool:
    work_words = [
        "対応",
        "作成",
        "修正",
        "直して",
        "更新",
        "確認お願いします",
        "レビュー",
        "提出",
        "共有してください",
    ]
    ambiguous_work_terms = {"あれ", "これ", "それ", "この資料", "前のやつ", "例の件", "いい感じ", "適当", "なる早"}
    return any(word in text for word in work_words) or any(term["term"] in ambiguous_work_terms for term in detected_terms)


def matches_ambiguous_term(text: str, term: str) -> bool:
    if term not in text:
        return False
    if term in {"あれ", "これ", "それ"}:
        harmless_patterns = [f"{term}はテスト", f"{term}がテスト", f"{term}でテスト"]
        if any(pattern in text for pattern in harmless_patterns):
            return False
    return True


def related_contexts(text: str, contexts: list[ContextMessage]) -> list[dict]:
    keywords = [word for word in ["資料", "提案", "見積", "プレゼン", "経営者", "システム"] if word in text]
    results: list[dict] = []
    for message in reversed(contexts):
        if len(results) >= 3:
            break
        score = 0.0
        for keyword in keywords:
            if keyword in message.body:
                score += 0.3
        if "資料" in text and "資料" in message.body:
            score += 0.3
        if score > 0:
            results.append(
                {
                    "id": message.id,
                    "type": "message",
                    "title": f"{message.sender_name or '不明'} の過去メッセージ",
                    "excerpt": message.body[:120],
                    "url": f"/messages/{message.id}",
                    "confidence": min(score, 0.95),
                }
            )
    return results


def answer(form_answers: dict[str, str] | None, *keys: str) -> str | None:
    if not form_answers:
        return None
    for key in keys:
        value = form_answers.get(key)
        if value and value.strip():
            return value.strip()
    return None


def dynamic_form_for_missing_items(missing_items: list[dict[str, str]]) -> list[dict] | None:
    fields = [
        FORM_FIELD_DEFINITIONS[item["item"]]
        for item in missing_items
        if item["item"] in FORM_FIELD_DEFINITIONS
    ]
    return fields or None
