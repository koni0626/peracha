from .models import WorkTable, WorkTableColumn, WorkTableRecord
from .serializer_utils import json_dict, json_list
from .work_table_schemas import WorkTableColumnOut, WorkTableOut, WorkTableRecordOut


def work_table_column_out(column: WorkTableColumn) -> WorkTableColumnOut:
    return WorkTableColumnOut(
        id=column.id,
        table_id=column.table_id,
        name=column.name,
        field_type=column.field_type,
        position=column.position,
        options=json_list(column.options_json),
        created_at=column.created_at,
    )


def work_table_record_out(record: WorkTableRecord) -> WorkTableRecordOut:
    return WorkTableRecordOut(
        id=record.id,
        table_id=record.table_id,
        parent_record_id=record.parent_record_id,
        position=record.position,
        values=json_dict(record.values_json),
        created_at=record.created_at,
        updated_at=record.updated_at,
    )


def work_table_out(
    table: WorkTable,
    columns: list[WorkTableColumn] | None = None,
    records: list[WorkTableRecord] | None = None,
) -> WorkTableOut:
    return WorkTableOut(
        id=table.id,
        room_id=table.room_id,
        name=table.name,
        description_markdown=table.description_markdown,
        position=table.position,
        columns=[work_table_column_out(column) for column in (columns or [])],
        records=[work_table_record_out(record) for record in (records or [])],
        created_at=table.created_at,
        updated_at=table.updated_at,
    )
