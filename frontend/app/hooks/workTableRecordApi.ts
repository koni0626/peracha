import { apiFetch } from "../api";
import type { WorkTable, WorkTableRecord, WorkTableRecordValue } from "../types";

export function createWorkTableRecord(
  tableId: string,
  values: Record<string, WorkTableRecordValue> = {},
  position?: number
) {
  return apiFetch<WorkTableRecord>(`/api/work-tables/${tableId}/records`, {
    method: "POST",
    body: JSON.stringify({ values, position }),
  });
}

export function createWorkTableRecordHistory(tableId: string, recordId: string) {
  return apiFetch<WorkTable>(`/api/work-tables/${tableId}/records/${recordId}/histories`, {
    method: "POST",
  });
}

export function updateWorkTableRecord(
  tableId: string,
  recordId: string,
  values: Record<string, WorkTableRecordValue>
) {
  return apiFetch<WorkTableRecord>(`/api/work-tables/${tableId}/records/${recordId}`, {
    method: "PATCH",
    body: JSON.stringify({ values }),
  });
}

export function updateWorkTableRecordOrder(tableId: string, recordIds: string[]) {
  return apiFetch<WorkTable>(`/api/work-tables/${tableId}/records/order`, {
    method: "PATCH",
    body: JSON.stringify({ record_ids: recordIds }),
  });
}
