import type { Dispatch, SetStateAction } from "react";

import type { WorkTable } from "../types";
import type { FilterMenuState, WorkTableSortState } from "../components/workTablePanelTypes";
import { removeById } from "./idListUtils";
import { deleteWorkTable } from "./workTablesApi";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { WorkTableListMutationState } from "./workTableMutationUtils";

type UseWorkTableDeletionOptions = WorkTableListMutationState & {
  activeTableId: string | null;
  setActiveTableId: Dispatch<SetStateAction<string | null>>;
  setColumnFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  setOpenFilterMenu: Dispatch<SetStateAction<FilterMenuState | null>>;
  setSortState: Dispatch<SetStateAction<WorkTableSortState>>;
};

export function useWorkTableDeletion({
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
}: UseWorkTableDeletionOptions) {
  async function removeTable(table: WorkTable) {
    if (saving || !window.confirm(`テーブル「${table.name}」を削除しますか？`)) {
      return;
    }
    const nextTables = removeById(tables, table.id);
    await runWorkTableMutation({ fallbackError: "テーブルを削除できませんでした", setError, setSaving }, async () => {
      await deleteWorkTable(table.id);
      setTables(nextTables);
      if (activeTableId === table.id) {
        setActiveTableId(nextTables[0]?.id ?? null);
      }
      setColumnFilters({});
      setSortState(null);
      setOpenFilterMenu(null);
    });
  }

  return {
    removeTable,
  };
}
