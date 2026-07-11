import { apiFetch } from "../api";
import type { Page, WorkTable } from "../types";

export function fetchRoomWorkTables(roomId: string) {
  return apiFetch<Page<WorkTable>>(`/api/rooms/${roomId}/work-tables`);
}

export function createRoomWorkTable(roomId: string, name: string) {
  return apiFetch<WorkTable>(`/api/rooms/${roomId}/work-tables`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function deleteWorkTable(tableId: string) {
  return apiFetch<WorkTable>(`/api/work-tables/${tableId}`, {
    method: "DELETE",
  });
}

export function updateWorkTable(tableId: string, input: { description_markdown?: string | null }) {
  return apiFetch<WorkTable>(`/api/work-tables/${tableId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function updateRoomWorkTableOrder(roomId: string, tableIds: string[]) {
  return apiFetch<Page<WorkTable>>(`/api/rooms/${roomId}/work-tables/order`, {
    method: "PATCH",
    body: JSON.stringify({ table_ids: tableIds }),
  });
}
