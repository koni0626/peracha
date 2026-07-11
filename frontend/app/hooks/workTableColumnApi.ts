import { apiFetch } from "../api";
import type { WorkTable, WorkTableColumn, WorkTableFieldType } from "../types";

export function createWorkTableColumn(
  tableId: string,
  input: { name: string; field_type: WorkTableFieldType; options?: string[]; position?: number }
) {
  return apiFetch<WorkTableColumn>(`/api/work-tables/${tableId}/columns`, {
    method: "POST",
    body: JSON.stringify({ ...input, options: input.options ?? [] }),
  });
}

export function updateWorkTableColumn(
  tableId: string,
  columnId: string,
  input: { name: string; field_type: WorkTableFieldType; options?: string[] }
) {
  return apiFetch<WorkTableColumn>(`/api/work-tables/${tableId}/columns/${columnId}`, {
    method: "PATCH",
    body: JSON.stringify({ ...input, options: input.options ?? [] }),
  });
}

export function updateWorkTableColumnOrder(tableId: string, columnIds: string[]) {
  return apiFetch<WorkTable>(`/api/work-tables/${tableId}/columns/order`, {
    method: "PATCH",
    body: JSON.stringify({ column_ids: columnIds }),
  });
}

export function deleteWorkTableColumn(tableId: string, columnId: string) {
  return apiFetch<WorkTable>(`/api/work-tables/${tableId}/columns/${columnId}`, {
    method: "DELETE",
  });
}
