from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import WorkTable, WorkTableColumn, WorkTableRecord
from .permissions import ensure_room_member


def table_columns(db: Session, table_id: str) -> list[WorkTableColumn]:
    return list(
        db.scalars(
            select(WorkTableColumn)
            .where(WorkTableColumn.table_id == table_id)
            .order_by(WorkTableColumn.position, WorkTableColumn.created_at)
        ).all()
    )


def table_records(db: Session, table_id: str) -> list[WorkTableRecord]:
    return list(
        db.scalars(
            select(WorkTableRecord)
            .where(WorkTableRecord.table_id == table_id)
            .order_by(WorkTableRecord.position, WorkTableRecord.created_at)
        ).all()
    )


def get_table_for_user(db: Session, table_id: str, user_id: str) -> WorkTable:
    table = db.get(WorkTable, table_id)
    if not table or table.deleted_at is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Table not found")
    ensure_room_member(db, table.room_id, user_id)
    return table


def next_position(db: Session, model, parent_field, parent_id: str) -> int:
    max_position = db.scalar(select(func.max(model.position)).where(parent_field == parent_id))
    return int(max_position or 0) + 1


def compact_column_positions(columns: list[WorkTableColumn]) -> None:
    for index, column in enumerate(columns, start=1):
        column.position = index


def room_tables(db: Session, room_id: str) -> list[WorkTable]:
    return list(
        db.scalars(
            select(WorkTable)
            .where(WorkTable.room_id == room_id, WorkTable.deleted_at.is_(None))
            .order_by(WorkTable.position, WorkTable.created_at)
        ).all()
    )
