import type { WorkTableColumn, WorkTableRecord } from "../types";
import { useWorkTableCellFileActions } from "./useWorkTableCellFileActions";
import { useWorkTableCellSaving } from "./useWorkTableCellSaving";
import { useWorkTableRecordHistory } from "./useWorkTableRecordHistory";
import { useWorkTableRecordOrdering } from "./useWorkTableRecordOrdering";
import {
  selectCellFileActionOptions,
  selectCellSavingOptions,
  selectRecordHistoryOptions,
  selectRecordOrderingOptions,
} from "./workTableRecordActionOptionSelectors";
import type { UseWorkTableRecordActionsOptions } from "./workTableRecordActionTypes";
import { firstFolderFileId, workTableCellKey } from "./workTableRecordUtils";

export function useWorkTableRecordActions(options: UseWorkTableRecordActionsOptions) {
  const recordOrdering = useWorkTableRecordOrdering(selectRecordOrderingOptions(options));
  const recordHistory = useWorkTableRecordHistory(selectRecordHistoryOptions(options));
  const { saveCell, saveCellValue } = useWorkTableCellSaving(selectCellSavingOptions(options));
  const { uploadCellFile, uploadFolderFiles } = useWorkTableCellFileActions(
    selectCellFileActionOptions(options, saveCellValue)
  );

  function openFolderCell(record: WorkTableRecord, column: WorkTableColumn) {
    const value = record.values[column.id];
    options.setFolderModal({ recordId: record.id, columnId: column.id });
    options.setFolderSelectedFileId(firstFolderFileId(value));
    options.setFolderPreviewError(null);
  }

  return {
    cellKey: workTableCellKey,
    dropRecord: recordOrdering.dropRecord,
    insertRecordAt: recordOrdering.insertRecordAt,
    insertRecordNear: recordOrdering.insertRecordNear,
    openFolderCell,
    saveCell,
    saveCellValue,
    saveRecordOrder: recordOrdering.saveRecordOrder,
    toggleRecordHistories: recordHistory.toggleRecordHistories,
    uploadCellFile,
    uploadFolderFiles,
  };
}
