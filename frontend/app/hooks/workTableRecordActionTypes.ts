import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableRecord } from "../types";
import type { FolderModalState, RecordContextMenuState } from "../components/workTablePanelTypes";

export type UseWorkTableRecordActionsOptions = {
  activeRecords: WorkTableRecord[];
  activeTable: WorkTable | null;
  canReorderRecords: boolean;
  draggedRecordId: string | null;
  folderSelectedFileId: string | null;
  roomId: string | null;
  saving: boolean;
  setDraggedRecordId: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setExpandedHistoryRecordIds: Dispatch<SetStateAction<string[]>>;
  setFolderModal: Dispatch<SetStateAction<FolderModalState | null>>;
  setFolderPreviewError: Dispatch<SetStateAction<string | null>>;
  setFolderSelectedFileId: Dispatch<SetStateAction<string | null>>;
  setRecordContextMenu: Dispatch<SetStateAction<RecordContextMenuState | null>>;
  setSaving: Dispatch<SetStateAction<boolean>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
  setUploadingCellKey: Dispatch<SetStateAction<string | null>>;
};
