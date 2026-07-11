from __future__ import annotations

import json
import re
from typing import Any

import httpx

from .config import settings


def _extract_text(response_json: dict[str, Any]) -> str | None:
    if isinstance(response_json.get("output_text"), str):
        return response_json["output_text"]
    chunks: list[str] = []
    for item in response_json.get("output", []):
        for content in item.get("content", []):
            text = content.get("text")
            if isinstance(text, str):
                chunks.append(text)
    return "\n".join(chunks) if chunks else None


def _is_string_dict_list(value: Any, required_keys: set[str]) -> bool:
    return isinstance(value, list) and all(
        isinstance(item, dict)
        and required_keys.issubset(item.keys())
        and all(isinstance(item.get(key), str) or item.get(key) is None for key in required_keys)
        for item in value
    )


def _is_dynamic_form(value: Any) -> bool:
    if value is None:
        return True
    if not isinstance(value, list):
        return False
    for item in value:
        if not isinstance(item, dict):
            return False
        if not {"id", "label", "type", "required", "options"}.issubset(item.keys()):
            return False
        if not all(isinstance(item.get(key), str) for key in ("id", "label", "type")):
            return False
        if not isinstance(item.get("required"), bool):
            return False
        if not isinstance(item.get("options"), list) or not all(isinstance(option, str) for option in item["options"]):
            return False
    return True


def _is_task_candidates(value: Any) -> bool:
    if not isinstance(value, list):
        return False
    for item in value:
        if not isinstance(item, dict):
            return False
        if not {"title", "assignee", "due_date", "completion_condition"}.issubset(item.keys()):
            return False
        if not isinstance(item["title"], str):
            return False
        if not all(isinstance(item.get(key), str) or item.get(key) is None for key in ("assignee", "due_date", "completion_condition")):
            return False
    return True


def _required_phrases_from_improved_text(text: str) -> list[str]:
    phrases: list[str] = []
    for line in text.splitlines():
        if ":" not in line:
            continue
        label, phrase = line.split(":", 1)
        if label.strip() not in {"対象", "依頼内容", "期限", "完了条件"}:
            continue
        phrase = phrase.strip()
        if phrase and "〇〇" not in phrase and "〇月〇日" not in phrase:
            phrases.append(phrase)
    return phrases


def _preserves_required_phrases(base_result: dict, value: str) -> bool:
    return all(phrase in value for phrase in _required_phrases_from_improved_text(base_result.get("improved_text", "")))


def _valid_diagnosis_override(key: str, value: Any, base_result: dict) -> bool:
    if key in {"facilitator_state", "detected_terms", "missing_items", "related_contexts", "dynamic_form", "task_candidates"}:
        return False
    if key == "improved_text":
        return isinstance(value, str) and _preserves_required_phrases(base_result, value)
    if key in {"original_text", "message_type", "reason"}:
        return isinstance(value, str)
    if key in {"facilitator_message", "inferred_subject"}:
        return isinstance(value, str) or value is None
    if key in {"clarity_score", "garbage_score", "context_confidence_score"}:
        return isinstance(value, int) and 0 <= value <= 100
    return False


def improve_diagnosis_with_openai(base_result: dict, text: str, contexts: list[dict]) -> dict:
    if not settings.openai_api_key:
        return base_result

    prompt = {
        "role": "user",
        "content": [
            {
                "type": "input_text",
                "text": (
                    "あなたはペラチャの業務メッセージ整形AIです。"
                    "次の診断JSONを、事実を捏造せずに改善してください。"
                    "必ずJSONだけを返してください。キーは元JSONと同じにしてください。\n\n"
                    f"入力文:\n{text}\n\n"
                    f"関連文脈:\n{json.dumps(contexts, ensure_ascii=False)}\n\n"
                    f"元診断JSON:\n{json.dumps(base_result, ensure_ascii=False)}"
                ),
            }
        ],
    }

    try:
        with httpx.Client(timeout=20) as client:
            response = client.post(
                "https://api.openai.com/v1/responses",
                headers={
                    "Authorization": f"Bearer {settings.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.openai_model,
                    "input": [prompt],
                },
            )
            response.raise_for_status()
        output_text = _extract_text(response.json())
        if not output_text:
            return base_result
        parsed = json.loads(output_text)
    except Exception:
        return base_result

    merged = base_result.copy()
    for key in merged:
        if key in parsed and _valid_diagnosis_override(key, parsed[key], base_result):
            merged[key] = parsed[key]
    return merged


def _looks_like_business_request_template(text: str) -> bool:
    return any(
        marker in text
        for marker in (
            "以下の内容について確認・対応をお願いします",
            "対象:",
            "対象：",
            "依頼内容:",
            "依頼内容：",
            "期限:",
            "期限：",
            "完了条件:",
            "完了条件：",
        )
    )


def proofread_text_with_openai(text: str) -> str:
    original = text.strip()
    if not original or not settings.openai_api_key:
        return original

    prompt = {
        "role": "user",
        "content": [
            {
                "type": "input_text",
                "text": (
                    "次の日本語テキストを校正してください。"
                    "誤字、脱字、明らかな変換ミス、余分な空白だけを直してください。"
                    "意味、情報量、文体、敬語、語尾、構成は変えないでください。"
                    "業務依頼文やテンプレートに変換しないでください。"
                    "修正不要なら原文をそのまま返してください。"
                    "出力は校正後の本文だけにしてください。\n\n"
                    f"本文:\n{original}"
                ),
            }
        ],
    }

    try:
        with httpx.Client(timeout=20) as client:
            response = client.post(
                "https://api.openai.com/v1/responses",
                headers={
                    "Authorization": f"Bearer {settings.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.openai_model,
                    "input": [prompt],
                },
            )
            response.raise_for_status()
        output_text = (_extract_text(response.json()) or "").strip()
    except Exception:
        return original

    if not output_text or _looks_like_business_request_template(output_text):
        return original
    if len(output_text) > max(len(original) * 2, len(original) + 80):
        return original
    return output_text


def _fallback_markdown_clarify(text: str) -> str:
    original = text.strip()
    if not original:
        return original

    lines = [line.strip(" 　") for line in original.splitlines() if line.strip()]
    if len(original) < 160 and len(lines) <= 2:
        return original

    title = lines[0]
    if len(title) > 42:
        title = f"{title[:42].rstrip()}..."

    details = lines[:8]
    if len(details) == 1:
        details = [part.strip() for part in original.replace("。", "。\n").splitlines() if part.strip()][:8]

    rows = [f"## {title}", "", "### 要点"]
    rows.extend(f"- {line}" for line in details)
    if len(lines) > len(details):
        rows.extend(["", "### 補足", f"- ほか {len(lines) - len(details)} 件の記載があります。"])
    return "\n".join(rows)


def _ensure_markdown_heading(original: str, value: str) -> str:
    original_lines = [line for line in original.splitlines() if line.strip()]
    should_have_heading = len(original) >= 80 or len(original_lines) >= 3
    if not should_have_heading or re.search(r"^#{1,6}\s", value, flags=re.MULTILINE):
        return value
    return f"## 要点\n\n{value}"


def clarify_text_with_openai(text: str) -> str:
    original = text.strip()
    if not original:
        return original
    fallback = _fallback_markdown_clarify(original)
    if not settings.openai_api_key:
        return fallback

    prompt = {
        "role": "user",
        "content": [
            {
                "type": "input_text",
                "text": (
                    "次の日本語テキストを、内容を捏造せず、読み手が理解しやすいMarkdown形式に整形してください。"
                    "長文の場合は見出し、要点、詳細、必要なら次のアクションに分けてください。"
                    "短い文章の場合は過剰にテンプレート化せず、自然なMarkdownまたは原文に近い形で返してください。"
                    "誤字脱字は自然に直して構いませんが、固有名詞や数値は変更しないでください。"
                    "出力は整形後の本文だけにしてください。\n\n"
                    f"本文:\n{original}"
                ),
            }
        ],
    }

    try:
        with httpx.Client(timeout=30) as client:
            response = client.post(
                "https://api.openai.com/v1/responses",
                headers={
                    "Authorization": f"Bearer {settings.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.openai_model,
                    "input": [prompt],
                },
            )
            response.raise_for_status()
        output_text = (_extract_text(response.json()) or "").strip()
    except Exception:
        return fallback

    if not output_text or _looks_like_business_request_template(output_text):
        return fallback
    if len(output_text) > max(len(original) * 3, len(original) + 1200):
        return fallback
    return _ensure_markdown_heading(original, output_text)


def summarize_board_with_openai(room_name: str, messages: list[dict]) -> dict | None:
    if not settings.openai_api_key:
        return None
    try:
        with httpx.Client(timeout=20) as client:
            response = client.post(
                "https://api.openai.com/v1/responses",
                headers={
                    "Authorization": f"Bearer {settings.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": settings.openai_model,
                    "input": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "input_text",
                                    "text": (
                                        "次のチャットを今ここボード用に整理してください。"
                                        "JSONだけを返してください。キーは title, key_points, decisions, "
                                        "open_questions, next_actions, risks です。\n\n"
                                        f"ルーム名: {room_name}\n"
                                        f"メッセージ:\n{json.dumps(messages, ensure_ascii=False)}"
                                    ),
                                }
                            ],
                        }
                    ],
                },
            )
            response.raise_for_status()
        output_text = _extract_text(response.json())
        return json.loads(output_text) if output_text else None
    except Exception:
        return None
