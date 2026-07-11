import type { Dispatch, SetStateAction } from "react";

import type { WorkTableColumn } from "../types";
import { hasSameIdOrder, reorderByDraggedId } from "./idListUtils";
import { updateWorkTableColumnOrder } from "./workTablesApi";
import { replaceWorkTable } from "./workTableListUtils";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { WorkTableMutationState } from "./workTableMutationUtils";

export type UseWorkTableColumnOrderingOptions = WorkTableMutationState & {
  draggedColumnId: string | null;
  setDraggedColumnId: Dispatch<SetStateAction<string | null>>;
};

export function useWorkTableColumnOrdering({
  activeTable,
  draggedColumnId,
  saving,
  setDraggedColumnId,
  setError,
  setSaving,
  setTables,
}: UseWorkTableColumnOrderingOptions) {
  async function saveColumnOrder(nextColumns: WorkTableColumn[]) {
    if (!activeTable || saving) {
      return;
    }

    if (hasSameIdOrder(activeTable.columns, nextColumns)) {
      return;
    }

    const optimisticTable = { ...activeTable, columns: nextColumns };
    setTables((current) => replaceWorkTable(current, optimisticTable));
    await runWorkTableMutation({ fallbackError: "列の順序を保存できませんでした。", setError, setSaving }, async () => {
      const updated = await updateWorkTableColumnOrder(activeTable.id, nextColumns.map((column) => column.id));
      setTables((current) => replaceWorkTable(current, updated));
    });
  }

  async function dropColumn(targetColumnId: string) {
    if (!activeTable || !draggedColumnId || draggedColumnId === targetColumnId) {
      setDraggedColumnId(null);
      return;
    }

    const nextColumns = reorderByDraggedId(activeTable.columns, draggedColumnId, targetColumnId);
    if (!nextColumns) {
      setDraggedColumnId(null);
      return;
    }

    setDraggedColumnId(null);
    await saveColumnOrder(nextColumns);
  }

  return { dropColumn, saveColumnOrder };
}
