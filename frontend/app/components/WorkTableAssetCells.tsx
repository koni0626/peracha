import { FolderOpen } from "lucide-react";

import type { WorkTableColumn, WorkTableRecord } from "../types";
import {
  WorkTableAttachedFile,
  WorkTableFileDropPrompt,
  WorkTableUploadStatus,
  workTableFolderLabel,
} from "./WorkTableAssetCellParts";
import { allowAssetDrop, handleFileCellDrop, handleFolderCellDrop } from "./workTableAssetDropHandlers";
import { isWorkTableFileValue, isWorkTableFolderValue } from "./workTableValueUtils";

type WorkTableFileCellProps = {
  column: WorkTableColumn;
  record: WorkTableRecord;
  uploading: boolean;
  onUploadFile: (file: File) => void | Promise<void>;
};

type WorkTableFolderCellProps = {
  column: WorkTableColumn;
  record: WorkTableRecord;
  uploading: boolean;
  onOpenFolder: () => void;
  onUploadFolderFiles: (files: File[]) => void | Promise<void>;
};

export function WorkTableFileCell({ column, record, uploading, onUploadFile }: WorkTableFileCellProps) {
  const rawValue = record.values[column.id];
  const fileValue = isWorkTableFileValue(rawValue) ? rawValue : null;
  return (
    <div
      className={`workTableFileCell ${fileValue ? "hasFile" : ""}`}
      onDragOver={allowAssetDrop}
      onDrop={(event) => handleFileCellDrop(event, onUploadFile)}
    >
      {fileValue ? (
        <WorkTableAttachedFile file={fileValue.file} />
      ) : (
        <WorkTableFileDropPrompt column={column} />
      )}
      <WorkTableUploadStatus uploading={uploading} />
    </div>
  );
}

export function WorkTableFolderCell({ column, record, uploading, onOpenFolder, onUploadFolderFiles }: WorkTableFolderCellProps) {
  const rawValue = record.values[column.id];
  const folderValue = isWorkTableFolderValue(rawValue) ? rawValue : { kind: "folder" as const, files: [] };
  return (
    <button
      type="button"
      className="workTableFolderCell"
      onClick={onOpenFolder}
      onDragOver={allowAssetDrop}
      onDrop={(event) => handleFolderCellDrop(event, onUploadFolderFiles)}
    >
      <FolderOpen size={22} />
      <span>{workTableFolderLabel(folderValue.files.length)}</span>
      <WorkTableUploadStatus uploading={uploading} />
    </button>
  );
}
