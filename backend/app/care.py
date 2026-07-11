from __future__ import annotations

from .facilitator import ContextMessage


def generate_care_intervention(messages: list[ContextMessage]) -> dict:
    joined = "\n".join(message.body for message in messages)
    care_type = "論点整理"
    emotional_summary = "会話が長くなり、判断論点が見えにくくなっています。"
    issue_summary = "事実、判断基準、次アクションを分けて整理する必要があります。"
    fact_check_points = ["何を決めたいのか", "誰に影響するのか", "移行・変更コストは何か"]
    decision_criteria = ["業務メリット", "導入コスト", "周知コスト", "運用責任者"]

    if any(word in joined for word in ["採用されない", "なぜ", "理解されない", "評価されない"]):
        care_type = "愚痴継続"
        emotional_summary = "提案が受け入れられないことへの不満が続いています。"
        issue_summary = "感情の話と、採用判断に必要な業務メリットの話が混ざっています。"
    if any(word in joined for word in ["Discord", "LINE WORKS", "Slack", "Chatwork"]):
        care_type = "ツール移行論点"
        issue_summary = "技術選定ではなく、ツール移行の業務メリットと運用コストを比較する論点です。"
        fact_check_points = ["現行ツールの課題", "移行先ツールの利用者メリット", "周知コスト", "移行後の運用責任者"]
    if any(word in joined for word in ["前にも", "何度も", "同じ", "ずっと"]):
        care_type = "持論ループ"
        emotional_summary = "同じ主張が繰り返され、追加の判断材料が増えていません。"

    facilitator_reply = (
        f"いったん整理します。今の論点は「{issue_summary}」です。\n\n"
        "比較するなら、1. 業務メリット、2. 移行・実装コスト、3. 周知コスト、"
        "4. 運用責任者、5. 期限を分けて確認すると判断しやすくなります。"
    )

    return {
        "care_type": care_type,
        "emotional_summary": emotional_summary,
        "issue_summary": issue_summary,
        "fact_check_points": fact_check_points,
        "decision_criteria": decision_criteria,
        "facilitator_reply": facilitator_reply,
        "suggest_board": True,
    }
