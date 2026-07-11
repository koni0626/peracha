import type { Dispatch, SetStateAction } from "react";

import type { WorkTableColumn } from "../types";
import type { WorkTableSortState } from "../components/workTablePanelTypes";
import { deleteWorkTableColumn } from "./workTablesApi";
import { replaceWorkTable } from "./workTableListUtils";
import { clearSortForColumn, removeColumnFilter } from "./workTableGridControlUtils";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { WorkTableMutationState } from "./workTableMutationUtils";

export type UseWorkTableColumnDeletionOptions = WorkTableMutationState & {
  setColumnFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  setSortState: Dispatch<SetStateAction<WorkTableSortState>>;
};

export function useWorkTableColumnDeletion({
  activeTable,
  saving,
  setColumnFilters,
  setError,
  setSaving,
  setSortState,
  setTables,
}: UseWorkTableColumnDeletionOptions) {
  async function removeColumn(column: WorkTableColumn) {
    if (!activeTable || saving || !window.confirm(`列「${column.name}」を削除しますか？`)) {
      return;
    }

    await runWorkTableMutation({ fallbackError: "列を削除できませんでした。", setError, setSaving }, async () => {
      const updated = await deleteWorkTableColumn(activeTable.id, column.id);
      setTables((current) => replaceWorkTable(current, updated));
      setColumnFilters((current) => removeColumnFilter(current, column.id));
      setSortState((current) => clearSortForColumn(current, column.id));
    });
  }

  return {
    removeColumn,
  };
}
