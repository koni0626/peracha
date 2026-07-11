import type { WorkTableColumn, WorkTableRecord, WorkTableRecordValue } from "../types";
import { getErrorMessage } from "./mutationRunner";
import { appendUploadedFolderFiles, uploadedCellFileValue } from "./workTableCellFileValues";
import type { UseWorkTableCellFileActionsOptions } from "./workTableCellFileActionTypes";
import { imageColumnRejectMessage, uploadFilesToRoom } from "./workTableCellFileUploadUtils";

export type { UseWorkTableCellFileActionsOptions } from "./workTableCellFileActionTypes";

export function useWorkTableCellFileActions({
  folderSelectedFileId,
  roomId,
  cellKey,
  saveCellValue,
  setError,
  setFolderSelectedFileId,
  setUploadingCellKey,
}: UseWorkTableCellFileActionsOptions) {
  async function uploadCellFile(record: WorkTableRecord, column: WorkTableColumn, file: File) {
    if (!roomId) {
      return;
    }
    const rejectionMessage = imageColumnRejectMessage(column.field_type, file);
    if (rejectionMessage) {
      setError(rejectionMessage);
      return;
    }
    const key = cellKey(record, column);
    setUploadingCellKey(key);
    setError(null);
    try {
      const [uploaded] = await uploadFilesToRoom(roomId, [file]);
      await saveCellValue(record, column, uploadedCellFileValue(column, uploaded));
    } catch (err) {
      setError(getErrorMessage(err, "ファイルをアップロードできませんでした。"));
    } finally {
      setUploadingCellKey(null);
    }
  }

  async function uploadFolderFiles(record: WorkTableRecord, column: WorkTableColumn, files: File[]) {
    if (!roomId || files.length === 0) {
      return;
    }
    const key = cellKey(record, column);
    const currentValue = record.values[column.id];
    setUploadingCellKey(key);
    setError(null);
    try {
      const uploadedFiles = await uploadFilesToRoom(roomId, files);
      await saveCellValue(record, column, appendUploadedFolderFiles(currentValue, uploadedFiles));
      setFolderSelectedFileId(uploadedFiles[0]?.id ?? folderSelectedFileId);
    } catch (err) {
      setError(getErrorMessage(err, "フォルダにアップロードできませんでした。"));
    } finally {
      setUploadingCellKey(null);
    }
  }

  return {
    uploadCellFile,
    uploadFolderFiles,
  };
}
