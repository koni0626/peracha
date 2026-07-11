import { useState } from "react";

import type { User, WorkTableColumn, WorkTableRecord, WorkTableRecordValue } from "../types";
import { WorkTableEditableCell, WorkTableReadonlyCell } from "../components/WorkTableCells";

type UseWorkTableCellRenderersOptions = {
  uploadingCellKey: string | null;
  cellKey: (record: WorkTableRecord, column: WorkTableColumn) => string;
  openFolderCell: (record: WorkTableRecord, column: WorkTableColumn) => void;
  saveCell: (record: WorkTableRecord, column: WorkTableColumn, rawValue: string) => void | Promise<void>;
  uploadCellFile: (record: WorkTableRecord, column: WorkTableColumn, file: File) => void | Promise<void>;
  uploadFolderFiles: (record: WorkTableRecord, column: WorkTableColumn, files: File[]) => void | Promise<void>;
  userOptions: User[];
};

export function useWorkTableCellRenderers({
  uploadingCellKey,
  cellKey,
  openFolderCell,
  saveCell,
  uploadCellFile,
  uploadFolderFiles,
  userOptions,
}: UseWorkTableCellRenderersOptions) {
  const [draftValues, setDraftValues] = useState<Record<string, WorkTableRecordValue>>({});

  function renderReadonlyCell(record: WorkTableRecord, column: WorkTableColumn) {
    return <WorkTableReadonlyCell column={column} record={record} userOptions={userOptions} />;
  }

  function renderCell(record: WorkTableRecord, column: WorkTableColumn) {
    const key = cellKey(record, column);
    return (
      <WorkTableEditableCell
        column={column}
        draftValue={draftValues[key]}
        record={record}
        uploading={uploadingCellKey === key}
        userOptions={userOptions}
        onDraftChange={(value) => setDraftValues((current) => ({ ...current, [key]: value }))}
        onOpenFolder={() => openFolderCell(record, column)}
        onSave={(value) => {
          void saveCell(record, column, value);
          setDraftValues((current) => {
            const next = { ...current };
            delete next[key];
            return next;
          });
        }}
        onUploadFile={(file) => uploadCellFile(record, column, file)}
        onUploadFolderFiles={(files) => uploadFolderFiles(record, column, files)}
      />
    );
  }

  return {
    renderCell,
    renderReadonlyCell,
  };
}
