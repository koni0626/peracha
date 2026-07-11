import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableColumn, WorkTableFieldType } from "../types";
import type { WorkTableSortState } from "../components/workTablePanelTypes";

export type UseWorkTableColumnActionsOptions = {
  activeTable: WorkTable | null;
  creatingColumnAt: number | null;
  draggedColumnId: string | null;
  editingColumn: WorkTableColumn | null;
  editingColumnName: string;
  editingColumnOptions: string;
  editingColumnType: WorkTableFieldType;
  newColumnName: string;
  newColumnOptions: string;
  newColumnType: WorkTableFieldType;
  saving: boolean;
  setColumnContextMenu: Dispatch<SetStateAction<{ columnId: string; x: number; y: number } | null>>;
  setColumnFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  setCreatingColumnAt: Dispatch<SetStateAction<number | null>>;
  setDraggedColumnId: Dispatch<SetStateAction<string | null>>;
  setEditingColumn: Dispatch<SetStateAction<WorkTableColumn | null>>;
  setEditingColumnName: Dispatch<SetStateAction<string>>;
  setEditingColumnOptions: Dispatch<SetStateAction<string>>;
  setEditingColumnType: Dispatch<SetStateAction<WorkTableFieldType>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setNewColumnName: Dispatch<SetStateAction<string>>;
  setNewColumnOptions: Dispatch<SetStateAction<string>>;
  setNewColumnType: Dispatch<SetStateAction<WorkTableFieldType>>;
  setSaving: Dispatch<SetStateAction<boolean>>;
  setSortState: Dispatch<SetStateAction<WorkTableSortState>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
};
