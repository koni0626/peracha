import { valueText } from "../components/appViewUtils";
import type { WorkTable, WorkTableColumn, WorkTableRecord } from "../types";

export function movableKanbanRecord(table: WorkTable, recordId: string) {
  const record = table.records.find((item) => item.id === recordId);
  return record && !record.parent_record_id ? record : null;
}

export function shouldMoveKanbanRecord(record: WorkTableRecord, statusColumn: WorkTableColumn, nextStatus: string) {
  return valueText(record.values[statusColumn.id]) !== nextStatus;
}

export function optimisticKanbanRecord(record: WorkTableRecord, statusColumn: WorkTableColumn, nextStatus: string) {
  return {
    ...record,
    values: { ...record.values, [statusColumn.id]: nextStatus },
  };
}
