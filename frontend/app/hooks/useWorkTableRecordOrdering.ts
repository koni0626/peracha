import { useWorkTableRecordInsertion } from "./useWorkTableRecordInsertion";
import { useWorkTableRecordReorder } from "./useWorkTableRecordReorder";
import type { UseWorkTableRecordOrderingOptions } from "./workTableRecordOrderingTypes";

export type { UseWorkTableRecordOrderingOptions } from "./workTableRecordOrderingTypes";

export function useWorkTableRecordOrdering({
  activeRecords,
  activeTable,
  canReorderRecords,
  draggedRecordId,
  saving,
  setDraggedRecordId,
  setError,
  setRecordContextMenu,
  setSaving,
  setTables,
}: UseWorkTableRecordOrderingOptions) {
  const insertion = useWorkTableRecordInsertion({
    activeRecords,
    activeTable,
    saving,
    setError,
    setRecordContextMenu,
    setSaving,
    setTables,
  });
  const reorder = useWorkTableRecordReorder({
    activeRecords,
    activeTable,
    canReorderRecords,
    draggedRecordId,
    saving,
    setDraggedRecordId,
    setError,
    setSaving,
    setTables,
  });

  return {
    dropRecord: reorder.dropRecord,
    insertRecordAt: insertion.insertRecordAt,
    insertRecordNear: insertion.insertRecordNear,
    saveRecordOrder: reorder.saveRecordOrder,
  };
}
