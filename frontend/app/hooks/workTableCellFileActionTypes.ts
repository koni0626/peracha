import type { Dispatch, SetStateAction } from "react";

import type { WorkTableColumn, WorkTableRecord, WorkTableRecordValue } from "../types";

export type UseWorkTableCellFileActionsOptions = {
  folderSelectedFileId: string | null;
  roomId: string | null;
  cellKey: (record: WorkTableRecord, column: WorkTableColumn) => string;
  saveCellValue: (record: WorkTableRecord, column: WorkTableColumn, nextValue: WorkTableRecordValue) => void | Promise<void>;
  setError: Dispatch<SetStateAction<string | null>>;
  setFolderSelectedFileId: Dispatch<SetStateAction<string | null>>;
  setUploadingCellKey: Dispatch<SetStateAction<string | null>>;
};
