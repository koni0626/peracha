from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, WorkTable, WorkTableColumn, WorkTableRecord, now_utc
from ..order_utils import normalize_insert_position, ordered_existing_ids, shift_positions_for_insert
from ..permissions import ensure_room_member
from ..schemas import PageOut
from ..security import get_current_user
from ..work_table_queries import (
    compact_column_positions,
    get_table_for_user,
    next_position,
    room_tables,
    table_columns,
    table_records,
)
from ..work_table_serializers import work_table_column_out, work_table_out, work_table_record_out
from ..work_table_schemas import (
    WorkTableColumnCreateIn,
    WorkTableColumnOrderIn,
    WorkTableColumnOut,
    WorkTableColumnUpdateIn,
    WorkTableCreateIn,
    WorkTableOrderIn,
    WorkTableOut,
    WorkTableRecordCreateIn,
    WorkTableRecordOrderIn,
    WorkTableRecordOut,
    WorkTableRecordUpdateIn,
    WorkTableUpdateIn,
)
from ..work_table_values import (
    column_options_json,
    normalize_record_values,
    record_values,
    record_values_json,
    remove_column_value,
)

router = APIRouter(tags=["work-tables"])


DEFAULT_COLUMNS = [
    {"name": "タイトル", "field_type": "text", "options": []},
    {"name": "状態", "field_type": "select", "options": ["未着手", "進行中", "確認待ち", "完了"]},
    {"name": "進捗率", "field_type": "number", "options": []},
    {"name": "開始日", "field_type": "date", "options": []},
    {"name": "終了日", "field_type": "date", "options": []},
    {"name": "説明", "field_type": "markdown", "options": []},
]


@router.get("/api/rooms/{room_id}/work-tables", response_model=PageOut[WorkTableOut])
def list_room_work_tables(
    room_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[WorkTableOut]:
    ensure_room_member(db, room_id, current_user.id)
    tables = room_tables(db, room_id)
    return PageOut[WorkTableOut](items=[work_table_out(table, table_columns(db, table.id), table_records(db, table.id)) for table in tables])


@router.post("/api/rooms/{room_id}/work-tables", response_model=WorkTableOut)
def create_room_work_table(
    room_id: str,
    payload: WorkTableCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableOut:
    ensure_room_member(db, room_id, current_user.id)
    table_name = payload.name.strip()
    if not table_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="テーブル名を入力してください")
    existing = db.scalar(
        select(WorkTable).where(
            WorkTable.room_id == room_id,
            WorkTable.deleted_at.is_(None),
            func.lower(WorkTable.name) == table_name.lower(),
        )
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="同じ名前のテーブルは既に存在します")

    table = WorkTable(
        room_id=room_id,
        name=table_name,
        created_by_user_id=current_user.id,
        position=next_position(db, WorkTable, WorkTable.room_id, room_id),
    )
    db.add(table)
    db.flush()

    columns = payload.columns or [WorkTableColumnCreateIn(**column) for column in DEFAULT_COLUMNS]
    for index, column in enumerate(columns, start=1):
        db.add(
            WorkTableColumn(
                table_id=table.id,
                name=column.name,
                field_type=column.field_type,
                position=index,
                options_json=column_options_json(column.options),
            )
        )
    db.commit()
    db.refresh(table)
    return work_table_out(table, table_columns(db, table.id), [])


@router.patch("/api/rooms/{room_id}/work-tables/order", response_model=PageOut[WorkTableOut])
def update_room_work_table_order(
    room_id: str,
    payload: WorkTableOrderIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PageOut[WorkTableOut]:
    ensure_room_member(db, room_id, current_user.id)
    tables = room_tables(db, room_id)
    tables_by_id = {table.id: table for table in tables}
    for index, table_id in enumerate(ordered_existing_ids(tables, payload.table_ids), start=1):
        tables_by_id[table_id].position = index
        tables_by_id[table_id].updated_at = now_utc()
    db.commit()
    updated_tables = room_tables(db, room_id)
    return PageOut[WorkTableOut](
        items=[work_table_out(table, table_columns(db, table.id), table_records(db, table.id)) for table in updated_tables]
    )


@router.get("/api/work-tables/{table_id}", response_model=WorkTableOut)
def get_work_table(
    table_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableOut:
    table = get_table_for_user(db, table_id, current_user.id)
    return work_table_out(table, table_columns(db, table.id), table_records(db, table.id))


@router.patch("/api/work-tables/{table_id}", response_model=WorkTableOut)
def update_work_table(
    table_id: str,
    payload: WorkTableUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableOut:
    table = get_table_for_user(db, table_id, current_user.id)
    description = payload.description_markdown.strip() if payload.description_markdown else None
    table.description_markdown = description or None
    table.updated_at = now_utc()
    db.commit()
    db.refresh(table)
    return work_table_out(table, table_columns(db, table.id), table_records(db, table.id))


@router.delete("/api/work-tables/{table_id}", response_model=WorkTableOut)
def delete_work_table(
    table_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableOut:
    table = get_table_for_user(db, table_id, current_user.id)
    table.deleted_at = now_utc()
    table.updated_at = table.deleted_at
    db.commit()
    return work_table_out(table, table_columns(db, table.id), table_records(db, table.id))


@router.post("/api/work-tables/{table_id}/columns", response_model=WorkTableColumnOut)
def create_work_table_column(
    table_id: str,
    payload: WorkTableColumnCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableColumnOut:
    table = get_table_for_user(db, table_id, current_user.id)
    columns = table_columns(db, table.id)
    insert_position = normalize_insert_position(payload.position, len(columns))
    shift_positions_for_insert(columns, insert_position)
    column = WorkTableColumn(
        table_id=table.id,
        name=payload.name,
        field_type=payload.field_type,
        position=insert_position,
        options_json=column_options_json(payload.options),
    )
    table.updated_at = now_utc()
    db.add(column)
    db.commit()
    db.refresh(column)
    return work_table_column_out(column)


@router.patch("/api/work-tables/{table_id}/columns/order", response_model=WorkTableOut)
def update_work_table_column_order(
    table_id: str,
    payload: WorkTableColumnOrderIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableOut:
    table = get_table_for_user(db, table_id, current_user.id)
    columns = table_columns(db, table.id)
    columns_by_id = {column.id: column for column in columns}
    for index, column_id in enumerate(ordered_existing_ids(columns, payload.column_ids), start=1):
        columns_by_id[column_id].position = index
    table.updated_at = now_utc()
    db.commit()
    return work_table_out(table, table_columns(db, table.id), table_records(db, table.id))


@router.patch("/api/work-tables/{table_id}/columns/{column_id}", response_model=WorkTableColumnOut)
def update_work_table_column(
    table_id: str,
    column_id: str,
    payload: WorkTableColumnUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableColumnOut:
    table = get_table_for_user(db, table_id, current_user.id)
    column = db.get(WorkTableColumn, column_id)
    if not column or column.table_id != table.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
    column.name = payload.name
    column.field_type = payload.field_type
    column.options_json = column_options_json(payload.options)
    table.updated_at = now_utc()
    db.commit()
    db.refresh(column)
    return work_table_column_out(column)


@router.delete("/api/work-tables/{table_id}/columns/{column_id}", response_model=WorkTableOut)
def delete_work_table_column(
    table_id: str,
    column_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableOut:
    table = get_table_for_user(db, table_id, current_user.id)
    column = db.get(WorkTableColumn, column_id)
    if not column or column.table_id != table.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Column not found")
    db.delete(column)
    for record in table_records(db, table.id):
        if remove_column_value(record, column_id):
            record.updated_at = now_utc()
    db.flush()
    compact_column_positions(table_columns(db, table.id))
    table.updated_at = now_utc()
    db.commit()
    return work_table_out(table, table_columns(db, table.id), table_records(db, table.id))


@router.post("/api/work-tables/{table_id}/records", response_model=WorkTableRecordOut)
def create_work_table_record(
    table_id: str,
    payload: WorkTableRecordCreateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableRecordOut:
    table = get_table_for_user(db, table_id, current_user.id)
    columns = table_columns(db, table.id)
    active_records = [record for record in table_records(db, table.id) if record.parent_record_id is None]
    insert_position = normalize_insert_position(payload.position, len(active_records))
    shift_positions_for_insert(active_records, insert_position)
    for existing_record in active_records:
        if existing_record.position > insert_position:
            existing_record.updated_at = now_utc()
    record = WorkTableRecord(
        table_id=table.id,
        position=insert_position,
        values_json=record_values_json(normalize_record_values(columns, payload.values)),
    )
    table.updated_at = now_utc()
    db.add(record)
    db.commit()
    db.refresh(record)
    return work_table_record_out(record)


@router.patch("/api/work-tables/{table_id}/records/order", response_model=WorkTableOut)
def update_work_table_record_order(
    table_id: str,
    payload: WorkTableRecordOrderIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableOut:
    table = get_table_for_user(db, table_id, current_user.id)
    records = [record for record in table_records(db, table.id) if record.parent_record_id is None]
    records_by_id = {record.id: record for record in records}
    for index, record_id in enumerate(ordered_existing_ids(records, payload.record_ids), start=1):
        records_by_id[record_id].position = index
        records_by_id[record_id].updated_at = now_utc()
    table.updated_at = now_utc()
    db.commit()
    return work_table_out(table, table_columns(db, table.id), table_records(db, table.id))


@router.post("/api/work-tables/{table_id}/records/{record_id}/histories", response_model=WorkTableOut)
def create_work_table_record_history(
    table_id: str,
    record_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableOut:
    table = get_table_for_user(db, table_id, current_user.id)
    record = db.get(WorkTableRecord, record_id)
    if not record or record.table_id != table.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    if record.parent_record_id is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="履歴から履歴は作成できません")
    history = WorkTableRecord(
        table_id=table.id,
        parent_record_id=record.id,
        position=0,
        values_json=record.values_json,
    )
    table.updated_at = now_utc()
    db.add(history)
    db.commit()
    return work_table_out(table, table_columns(db, table.id), table_records(db, table.id))


@router.patch("/api/work-tables/{table_id}/records/{record_id}", response_model=WorkTableRecordOut)
def update_work_table_record(
    table_id: str,
    record_id: str,
    payload: WorkTableRecordUpdateIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WorkTableRecordOut:
    table = get_table_for_user(db, table_id, current_user.id)
    record = db.get(WorkTableRecord, record_id)
    if not record or record.table_id != table.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found")
    if record.parent_record_id is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="履歴は編集できません")
    columns = table_columns(db, table.id)
    current_values = record_values(record)
    current_values.update(normalize_record_values(columns, payload.values))
    record.values_json = record_values_json(current_values)
    record.updated_at = now_utc()
    table.updated_at = now_utc()
    db.commit()
    db.refresh(record)
    return work_table_record_out(record)
