import type { WorkTable, WorkTableRecord } from "../types";
import type { ColumnContextMenuState, FilterMenuState, RecordContextMenuState } from "./workTablePanelTypes";

export function columnForFilterMenu(activeTable: WorkTable, menu: FilterMenuState) {
  return activeTable.columns.find((item) => item.id === menu.columnId) ?? null;
}

export function columnForContextMenu(activeTable: WorkTable, menu: ColumnContextMenuState) {
  return activeTable.columns.find((item) => item.id === menu.columnId) ?? null;
}

export function recordForContextMenu(activeRecords: WorkTableRecord[], menu: RecordContextMenuState) {
  return menu.recordId ? activeRecords.find((item) => item.id === menu.recordId) ?? null : null;
}
