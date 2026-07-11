import type { UseWorkTableCellFileActionsOptions } from "./useWorkTableCellFileActions";
import type { UseWorkTableCellSavingOptions } from "./useWorkTableCellSaving";
import type { UseWorkTableRecordActionsOptions } from "./workTableRecordActionTypes";
import type { UseWorkTableRecordHistoryOptions } from "./useWorkTableRecordHistory";
import type { UseWorkTableRecordOrderingOptions } from "./useWorkTableRecordOrdering";
import type { WorkTableMutationState } from "./workTableMutationUtils";
import { workTableCellKey } from "./workTableRecordUtils";

function selectRecordMutationState({
  activeTable,
  saving,
  setError,
  setSaving,
  setTables,
}: UseWorkTableRecordActionsOptions): WorkTableMutationState {
  return {
    activeTable,
    saving,
    setError,
    setSaving,
    setTables,
  };
}

export function selectRecordOrderingOptions(
  options: UseWorkTableRecordActionsOptions
): UseWorkTableRecordOrderingOptions {
  return {
    ...selectRecordMutationState(options),
    activeRecords: options.activeRecords,
    canReorderRecords: options.canReorderRecords,
    draggedRecordId: options.draggedRecordId,
    setDraggedRecordId: options.setDraggedRecordId,
    setRecordContextMenu: options.setRecordContextMenu,
  };
}

export function selectRecordHistoryOptions(
  options: UseWorkTableRecordActionsOptions
): UseWorkTableRecordHistoryOptions {
  return {
    ...selectRecordMutationState(options),
    setExpandedHistoryRecordIds: options.setExpandedHistoryRecordIds,
  };
}

export function selectCellSavingOptions(options: UseWorkTableRecordActionsOptions): UseWorkTableCellSavingOptions {
  return {
    activeTable: options.activeTable,
    setError: options.setError,
    setTables: options.setTables,
  };
}

export function selectCellFileActionOptions(
  options: UseWorkTableRecordActionsOptions,
  saveCellValue: UseWorkTableCellFileActionsOptions["saveCellValue"]
): UseWorkTableCellFileActionsOptions {
  return {
    folderSelectedFileId: options.folderSelectedFileId,
    roomId: options.roomId,
    cellKey: workTableCellKey,
    saveCellValue,
    setError: options.setError,
    setFolderSelectedFileId: options.setFolderSelectedFileId,
    setUploadingCellKey: options.setUploadingCellKey,
  };
}
