from __future__ import annotations

import json

import httpx

from .config import settings


def _image_timeout() -> httpx.Timeout:
    return httpx.Timeout(settings.openai_image_timeout_seconds)


def _extract_image_url(response_json: dict) -> str | None:
    data = response_json.get("data", [])
    if not data:
        return None
    first = data[0]
    if first.get("b64_json"):
        return f"data:image/png;base64,{first['b64_json']}"
    if first.get("url"):
        return first["url"]
    return None


def _post_image_generation(prompt: str, image_model: str, size: str) -> str | None:
    with httpx.Client(timeout=_image_timeout()) as client:
        response = client.post(
            "https://api.openai.com/v1/images/generations",
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": image_model,
                "prompt": prompt,
                "size": size,
                "quality": "medium",
                "output_format": "png",
                "n": 1,
            },
        )
        response.raise_for_status()
    return _extract_image_url(response.json())


def generate_board_image_with_openai(summary: dict, image_model: str) -> str | None:
    if not settings.openai_api_key:
        return None

    prompt = (
        "ペラチャの共有ボードとして、業務チャットの現在地を1枚の横長インフォグラフィックにしてください。"
        "画像内の文字は日本語で、読みやすく、誤字を避け、以下の構造をそのまま短く配置してください。"
        "セクションは「重要論点」「決定事項」「未決事項」「次アクション」「放置リスク」。"
        "Slack風の落ち着いた業務UIに合う、白背景、ティール、ネイビー、細い罫線のデザインにしてください。\n\n"
        f"構造化データ:\n{json.dumps(summary, ensure_ascii=False)}"
    )

    try:
        return _post_image_generation(prompt, image_model, "1536x1024")
    except Exception:
        return None


def generate_peraichi_image_with_openai(room_name: str, text: str, image_model: str) -> str | None:
    if not settings.openai_api_key:
        return None

    prompt = (
        "ペラチャの共有画像として、次の記事・文章を1枚の日本語インフォグラフィックにしてください。"
        "目的は、記事の内容を読み手に分かりやすく伝えることです。"
        "文字は画像内に読みやすく配置し、意味を変えず、見出し・概要・重要ポイント・背景・数字や固有名詞が分かる構成にしてください。"
        "依頼事項、期限、次アクション、対応依頼、確認依頼の欄は作らないでください。"
        "本文に明示されていないタスクや締切を推測して追加しないでください。"
        "白背景、ティール、ネイビー、細い罫線、Slack風の落ち着いた業務UIに合うデザイン。"
        "タイトルは短く、本文は箇条書きを中心にしてください。\n\n"
        f"ルーム名: {room_name}\n"
        f"記事・文章:\n{text}"
    )

    try:
        return _post_image_generation(prompt, image_model, "1536x1024")
    except Exception:
        return None
