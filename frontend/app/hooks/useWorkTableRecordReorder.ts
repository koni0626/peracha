import type { WorkTableRecord } from "../types";
import { hasSameIdOrder, reorderByDraggedId } from "./idListUtils";
import { updateWorkTableRecordOrder } from "./workTablesApi";
import { replaceWorkTable } from "./workTableListUtils";
import { mergeActiveRecordOrder, updateTableRecords } from "./workTableRecordUtils";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { UseWorkTableRecordReorderOptions } from "./workTableRecordOrderingTypes";

export function useWorkTableRecordReorder({
  activeRecords,
  activeTable,
  canReorderRecords,
  draggedRecordId,
  saving,
  setDraggedRecordId,
  setError,
  setSaving,
  setTables,
}: UseWorkTableRecordReorderOptions) {
  async function saveRecordOrder(nextRecords: WorkTableRecord[]) {
    if (!activeTable || saving) {
      return;
    }

    if (hasSameIdOrder(activeRecords, nextRecords)) {
      return;
    }

    setTables((current) =>
      updateTableRecords(current, activeTable.id, (records) => mergeActiveRecordOrder(records, nextRecords))
    );
    await runWorkTableMutation({ fallbackError: "行の順序を保存できませんでした。", setError, setSaving }, async () => {
      const updated = await updateWorkTableRecordOrder(activeTable.id, nextRecords.map((record) => record.id));
      setTables((current) => replaceWorkTable(current, updated));
    });
  }

  async function dropRecord(targetRecordId: string) {
    if (!activeTable || !draggedRecordId || draggedRecordId === targetRecordId || !canReorderRecords) {
      setDraggedRecordId(null);
      return;
    }

    const nextRecords = reorderByDraggedId(activeRecords, draggedRecordId, targetRecordId);
    if (!nextRecords) {
      setDraggedRecordId(null);
      return;
    }

    setDraggedRecordId(null);
    await saveRecordOrder(nextRecords);
  }

  return {
    dropRecord,
    saveRecordOrder,
  };
}
