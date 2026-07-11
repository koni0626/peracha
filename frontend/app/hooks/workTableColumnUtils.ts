import type { WorkTable, WorkTableColumn, WorkTableFieldType } from "../types";

export function updateTableColumns(
  tables: WorkTable[],
  tableId: string,
  updateColumns: (columns: WorkTableColumn[]) => WorkTableColumn[]
) {
  return tables.map((table) => (table.id === tableId ? { ...table, columns: updateColumns(table.columns) } : table));
}

export function parseColumnOptions(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function newWorkTableColumnInput({
  name,
  fieldType,
  options,
  position,
}: {
  name: string;
  fieldType: WorkTableFieldType;
  options: string;
  position: number;
}) {
  return {
    name: name.trim(),
    field_type: fieldType,
    options: parseColumnOptions(options),
    position,
  };
}

export function updatedWorkTableColumnInput({
  name,
  fieldType,
  options,
}: {
  name: string;
  fieldType: WorkTableFieldType;
  options: string;
}) {
  return {
    name: name.trim(),
    field_type: fieldType,
    options: parseColumnOptions(options),
  };
}

export function columnInsertPosition(
  columns: WorkTableColumn[],
  targetColumnId: string,
  side: "left" | "right"
) {
  const index = columns.findIndex((item) => item.id === targetColumnId);
  if (index < 0) {
    return null;
  }
  return side === "left" ? index + 1 : index + 2;
}

export function insertColumn(columns: WorkTableColumn[], column: WorkTableColumn, insertPosition: number) {
  const nextColumns = [...columns];
  const insertIndex = Math.max(0, Math.min(insertPosition - 1, nextColumns.length));
  nextColumns.splice(insertIndex, 0, column);
  return nextColumns.map((item, index) => ({ ...item, position: index + 1 }));
}

export function replaceColumn(columns: WorkTableColumn[], replacement: WorkTableColumn) {
  return columns.map((column) => (column.id === replacement.id ? replacement : column));
}
