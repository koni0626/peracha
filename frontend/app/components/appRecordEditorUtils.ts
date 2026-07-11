import type { WorkTableColumn, WorkTableRecordValue } from "../types";

export function parseAppRecordDraftValue(column: WorkTableColumn, value: string): WorkTableRecordValue {
  if (value === "") {
    return null;
  }
  if (column.field_type === "number") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return value;
}
