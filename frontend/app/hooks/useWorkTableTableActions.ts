import type { Dispatch, SetStateAction } from "react";

import type { FilterMenuState, WorkTableSortState } from "../components/workTablePanelTypes";
import type { WorkTable } from "../types";
import { useWorkTableCreation } from "./useWorkTableCreation";
import { useWorkTableDeletion } from "./useWorkTableDeletion";
import { useWorkTableOrdering } from "./useWorkTableOrdering";

export type UseWorkTableTableActionsOptions = {
  activeTableId: string | null;
  draggedTableId: string | null;
  roomId: string | null;
  saving: boolean;
  tableName: string;
  tables: WorkTable[];
  setActiveTableId: Dispatch<SetStateAction<string | null>>;
  setColumnFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  setCreatingTable: Dispatch<SetStateAction<boolean>>;
  setDraggedTableId: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setOpenFilterMenu: Dispatch<SetStateAction<FilterMenuState | null>>;
  setSaving: Dispatch<SetStateAction<boolean>>;
  setSortState: Dispatch<SetStateAction<WorkTableSortState>>;
  setTableName: Dispatch<SetStateAction<string>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
};

export function useWorkTableTableActions({
  activeTableId,
  draggedTableId,
  roomId,
  saving,
  tableName,
  tables,
  setActiveTableId,
  setColumnFilters,
  setCreatingTable,
  setDraggedTableId,
  setError,
  setOpenFilterMenu,
  setSaving,
  setSortState,
  setTableName,
  setTables,
}: UseWorkTableTableActionsOptions) {
  const { removeTable } = useWorkTableDeletion({
    activeTableId,
    saving,
    tables,
    setActiveTableId,
    setColumnFilters,
    setError,
    setOpenFilterMenu,
    setSaving,
    setSortState,
    setTables,
  });
  const { addTable } = useWorkTableCreation({
    roomId,
    saving,
    tableName,
    tables,
    setActiveTableId,
    setCreatingTable,
    setError,
    setSaving,
    setTableName,
    setTables,
  });
  const { dropTable, saveTableOrder } = useWorkTableOrdering({
    draggedTableId,
    roomId,
    saving,
    tables,
    setDraggedTableId,
    setError,
    setSaving,
    setTables,
  });

  return {
    addTable,
    dropTable,
    removeTable,
    saveTableOrder,
  };
}
