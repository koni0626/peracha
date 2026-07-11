from datetime import datetime

from pydantic import BaseModel, Field


WorkTableCellValue = str | int | float | bool | None | dict | list


class WorkTableColumnCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    field_type: str = Field(default="text", pattern="^(text|number|date|markdown|select|user|image|file|folder)$")
    options: list[str] = []
    position: int | None = Field(default=None, ge=1)


class WorkTableColumnUpdateIn(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    field_type: str = Field(default="text", pattern="^(text|number|date|markdown|select|user|image|file|folder)$")
    options: list[str] = []


class WorkTableCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    columns: list[WorkTableColumnCreateIn] = []


class WorkTableUpdateIn(BaseModel):
    description_markdown: str | None = Field(default=None, max_length=10000)


class WorkTableRecordCreateIn(BaseModel):
    values: dict[str, WorkTableCellValue] = {}
    position: int | None = Field(default=None, ge=1)


class WorkTableRecordUpdateIn(BaseModel):
    values: dict[str, WorkTableCellValue]


class WorkTableColumnOrderIn(BaseModel):
    column_ids: list[str] = Field(min_length=1)


class WorkTableOrderIn(BaseModel):
    table_ids: list[str] = Field(min_length=1)


class WorkTableRecordOrderIn(BaseModel):
    record_ids: list[str] = Field(min_length=1)


class WorkTableColumnOut(BaseModel):
    id: str
    table_id: str
    name: str
    field_type: str
    position: int
    options: list[str] = []
    created_at: datetime


class WorkTableRecordOut(BaseModel):
    id: str
    table_id: str
    parent_record_id: str | None
    position: int
    values: dict[str, WorkTableCellValue]
    created_at: datetime
    updated_at: datetime


class WorkTableOut(BaseModel):
    id: str
    room_id: str
    name: str
    description_markdown: str | None
    position: int
    columns: list[WorkTableColumnOut] = []
    records: list[WorkTableRecordOut] = []
    created_at: datetime
    updated_at: datetime
