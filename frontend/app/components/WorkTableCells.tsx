import type { User, WorkTableColumn, WorkTableRecord, WorkTableRecordValue } from "../types";
import { WorkTableFileCell, WorkTableFolderCell } from "./WorkTableAssetCells";
export { WorkTableReadonlyCell } from "./WorkTableReadonlyCell";
import { WorkTableScalarInput } from "./WorkTableScalarInputs";
import { inputValue } from "./workTableValueUtils";

type WorkTableEditableCellProps = {
  column: WorkTableColumn;
  draftValue: WorkTableRecordValue | undefined;
  record: WorkTableRecord;
  uploading: boolean;
  userOptions: User[];
  onDraftChange: (value: string) => void;
  onOpenFolder: () => void;
  onSave: (value: string) => void | Promise<void>;
  onUploadFile: (file: File) => void | Promise<void>;
  onUploadFolderFiles: (files: File[]) => void | Promise<void>;
};

export function WorkTableEditableCell({
  column,
  draftValue,
  record,
  uploading,
  userOptions,
  onDraftChange,
  onOpenFolder,
  onSave,
  onUploadFile,
  onUploadFolderFiles,
}: WorkTableEditableCellProps) {
  if (column.field_type === "image" || column.field_type === "file") {
    return <WorkTableFileCell column={column} record={record} uploading={uploading} onUploadFile={onUploadFile} />;
  }
  if (column.field_type === "folder") {
    return (
      <WorkTableFolderCell
        column={column}
        record={record}
        uploading={uploading}
        onOpenFolder={onOpenFolder}
        onUploadFolderFiles={onUploadFolderFiles}
      />
    );
  }

  const value = inputValue(draftValue ?? record.values[column.id]);
  return (
    <WorkTableScalarInput
      column={column}
      userOptions={userOptions}
      value={value}
      onDraftChange={onDraftChange}
      onSave={onSave}
    />
  );
}
