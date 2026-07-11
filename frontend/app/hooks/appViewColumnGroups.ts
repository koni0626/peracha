import type { WorkTable, WorkTableColumn } from "../types";

export function appViewColumns(table: WorkTable | null) {
  return table?.columns ?? [];
}

export function appViewTextColumns(table: WorkTable | null) {
  return appViewColumns(table).filter((column) => ["text", "markdown", "user", "select"].includes(column.field_type));
}

export function appViewDateColumns(table: WorkTable | null) {
  return appViewColumns(table).filter((column) => column.field_type === "date");
}

export function appViewSelectColumns(table: WorkTable | null) {
  return appViewColumns(table).filter((column) => column.field_type === "select");
}

export function appViewProgressColumns(table: WorkTable | null) {
  return appViewColumns(table).filter((column) => ["number", "text", "select"].includes(column.field_type));
}

export function columnById(table: WorkTable | null, columnId: string): WorkTableColumn | null {
  return appViewColumns(table).find((column) => column.id === columnId) ?? null;
}
