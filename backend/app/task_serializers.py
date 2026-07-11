import json

from .models import CareIntervention, Task
from .serializer_utils import json_list
from .task_schemas import CareOut, TaskOut


def care_out(care: CareIntervention) -> CareOut:
    return CareOut(
        id=care.id,
        room_id=care.room_id,
        care_type=care.care_type,
        emotional_summary=care.emotional_summary,
        issue_summary=care.issue_summary,
        fact_check_points=json_list(care.fact_check_points_json),
        decision_criteria=json_list(care.decision_criteria_json),
        facilitator_reply=care.facilitator_reply,
        suggest_board=care.suggest_board == "true",
        created_at=care.created_at,
    )


def task_out(task: Task) -> TaskOut:
    metadata = json.loads(task.metadata_json) if task.metadata_json else None
    return TaskOut(
        id=task.id,
        room_id=task.room_id,
        diagnosis_id=task.diagnosis_id,
        room_message_id=task.room_message_id,
        title=task.title,
        assignee=task.assignee,
        due_date=task.due_date,
        status=task.status,
        completion_condition=task.completion_condition,
        progress_note=task.progress_note,
        result_message_id=task.result_message_id,
        metadata=metadata,
        created_at=task.created_at,
        updated_at=task.updated_at,
    )
