import json
from typing import Any

from .models import WorkTableColumn, WorkTableRecord


def column_options_json(options: list[str] | None) -> str | None:
    return json.dumps(options, ensure_ascii=False) if options else None


def normalize_record_values(columns: list[WorkTableColumn], values: dict[str, Any]) -> dict[str, Any]:
    column_ids = {column.id for column in columns}
    return {key: value for key, value in values.items() if key in column_ids}


def record_values(record: WorkTableRecord) -> dict[str, Any]:
    return json.loads(record.values_json or "{}")


def record_values_json(values: dict[str, Any]) -> str:
    return json.dumps(values, ensure_ascii=False)


def remove_column_value(record: WorkTableRecord, column_id: str) -> bool:
    values = record_values(record)
    if column_id not in values:
        return False
    values.pop(column_id, None)
    record.values_json = record_values_json(values)
    return True
