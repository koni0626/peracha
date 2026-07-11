import type { Dispatch, SetStateAction } from "react";

import type { WorkTable } from "../types";
import { hasSameIdOrder, reorderByDraggedId } from "./idListUtils";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { WorkTableListMutationState } from "./workTableMutationUtils";
import { updateRoomWorkTableOrder } from "./workTablesApi";

type UseWorkTableOrderingOptions = WorkTableListMutationState & {
  draggedTableId: string | null;
  roomId: string | null;
  setDraggedTableId: Dispatch<SetStateAction<string | null>>;
};

export function useWorkTableOrdering({
  draggedTableId,
  roomId,
  saving,
  tables,
  setDraggedTableId,
  setError,
  setSaving,
  setTables,
}: UseWorkTableOrderingOptions) {
  async function saveTableOrder(nextTables: WorkTable[]) {
    if (!roomId || saving) {
      return;
    }
    if (hasSameIdOrder(tables, nextTables)) {
      return;
    }
    setTables(nextTables);
    await runWorkTableMutation({ fallbackError: "テーブルの順序を保存できませんでした", setError, setSaving }, async () => {
      const updated = await updateRoomWorkTableOrder(
        roomId,
        nextTables.map((table) => table.id),
      );
      setTables(updated.items);
    });
  }

  async function dropTable(targetTableId: string) {
    if (!draggedTableId || draggedTableId === targetTableId) {
      setDraggedTableId(null);
      return;
    }
    const nextTables = reorderByDraggedId(tables, draggedTableId, targetTableId);
    if (!nextTables) {
      setDraggedTableId(null);
      return;
    }
    setDraggedTableId(null);
    await saveTableOrder(nextTables);
  }

  return {
    dropTable,
    saveTableOrder,
  };
}
