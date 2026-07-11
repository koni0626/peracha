import type { WorkTableColumn, WorkTableRecord } from "../types";
import { valueText } from "./appViewUtils";

export function kanbanStatuses(records: WorkTableRecord[], statusColumn: WorkTableColumn) {
  if (statusColumn.options.length) {
    return statusColumn.options;
  }
  return Array.from(new Set(records.map((record) => valueText(record.values[statusColumn.id])).filter(Boolean)));
}

export function recordsForKanbanStatus(
  records: WorkTableRecord[],
  statusColumn: WorkTableColumn,
  status: string
) {
  return records.filter((record) => valueText(record.values[statusColumn.id]) === status);
}
