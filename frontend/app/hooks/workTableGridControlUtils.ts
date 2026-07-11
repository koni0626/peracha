import type { WorkTableSortState } from "../components/workTablePanelTypes";
import { toggleId } from "./idListUtils";

export function toggleColumnFilterValue(current: Record<string, string[]>, columnId: string, value: string) {
  const selected = current[columnId] ?? [];
  const nextSelected = toggleId(selected, value);
  return { ...current, [columnId]: nextSelected };
}

export function nextSortState(current: WorkTableSortState, columnId: string): WorkTableSortState {
  if (current?.columnId !== columnId) {
    return { columnId, direction: "asc" };
  }
  if (current.direction === "asc") {
    return { columnId, direction: "desc" };
  }
  return null;
}

export function removeColumnFilter(current: Record<string, string[]>, columnId: string) {
  const next = { ...current };
  delete next[columnId];
  return next;
}

export function clearSortForColumn(current: WorkTableSortState, columnId: string): WorkTableSortState {
  return current?.columnId === columnId ? null : current;
}
