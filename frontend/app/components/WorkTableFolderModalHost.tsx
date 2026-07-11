import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableColumn, WorkTableRecord } from "../types";
import type { FolderModalState } from "./workTablePanelTypes";
import { WorkTableFolderModal } from "./WorkTableFolderModal";
import { isWorkTableFolderValue } from "./workTableValueUtils";

type WorkTableFolderModalHostProps = {
  activeTable: WorkTable | null;
  folderModal: FolderModalState | null;
  folderPreviewError: string | null;
  folderSelectedFileId: string | null;
  onClose: () => void;
  onUploadFiles: (record: WorkTableRecord, column: WorkTableColumn, files: File[]) => void | Promise<void>;
  setFolderPreviewError: Dispatch<SetStateAction<string | null>>;
  setFolderSelectedFileId: Dispatch<SetStateAction<string | null>>;
};

export function WorkTableFolderModalHost({
  activeTable,
  folderModal,
  folderPreviewError,
  folderSelectedFileId,
  onClose,
  onUploadFiles,
  setFolderPreviewError,
  setFolderSelectedFileId,
}: WorkTableFolderModalHostProps) {
  if (!folderModal || !activeTable) {
    return null;
  }

  const record = activeTable.records.find((item) => item.id === folderModal.recordId);
  const column = activeTable.columns.find((item) => item.id === folderModal.columnId);
  if (!record || !column) {
    return null;
  }

  const rawValue = record.values[column.id];
  const folderValue = isWorkTableFolderValue(rawValue) ? rawValue : { kind: "folder" as const, files: [] };
  const selectedFile = folderValue.files.find((file) => file.id === folderSelectedFileId) ?? folderValue.files[0] ?? null;

  return (
    <WorkTableFolderModal
      column={column}
      folderPreviewError={folderPreviewError}
      folderValue={folderValue}
      record={record}
      selectedFile={selectedFile}
      onClose={onClose}
      onSelectFile={(fileId) => setFolderSelectedFileId(fileId)}
      onUploadFiles={onUploadFiles}
      setFolderPreviewError={setFolderPreviewError}
    />
  );
}
