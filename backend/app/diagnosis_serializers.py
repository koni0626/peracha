from .diagnosis_schemas import DiagnosisOut
from .models import Diagnosis
from .serializer_utils import json_list


def diagnosis_out(diagnosis: Diagnosis) -> DiagnosisOut:
    return DiagnosisOut(
        id=diagnosis.id,
        room_id=diagnosis.room_id,
        room_message_id=diagnosis.room_message_id,
        original_text=diagnosis.original_text,
        improved_text=diagnosis.improved_text,
        message_type=diagnosis.message_type,
        clarity_score=diagnosis.clarity_score,
        garbage_score=diagnosis.garbage_score,
        context_confidence_score=diagnosis.context_confidence_score,
        facilitator_state=diagnosis.facilitator_state,
        facilitator_message=diagnosis.facilitator_message,
        inferred_subject=diagnosis.inferred_subject,
        reason=diagnosis.reason,
        detected_terms=json_list(diagnosis.detected_terms_json),
        missing_items=json_list(diagnosis.missing_items_json),
        related_contexts=json_list(diagnosis.related_contexts_json),
        dynamic_form=json_list(diagnosis.dynamic_form_json) if diagnosis.dynamic_form_json else None,
        task_candidates=json_list(diagnosis.task_candidates_json),
        created_at=diagnosis.created_at,
    )
