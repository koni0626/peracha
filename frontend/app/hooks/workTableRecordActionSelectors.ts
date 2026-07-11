import type { WorkTable, WorkTableRecord } from "../types";
import type { UseWorkTableRecordActionsOptions } from "./workTableRecordActionTypes";
import type { WorkTablesPanelState } from "./workTablePanelActionSelectorTypes";
import { selectWorkTableMutationState } from "./workTablePanelMutationSelectors";

type SelectWorkTableRecordActionOptionsParams = {
  activeRecords: WorkTableRecord[];
  activeTable: WorkTable | null;
  canReorderRecords: boolean;
  roomId: string | null;
  state: WorkTablesPanelState;
};

export function selectWorkTableRecordActionOptions({
  activeRecords,
  activeTable,
  canReorderRecords,
  roomId,
  state,
}: SelectWorkTableRecordActionOptionsParams): UseWorkTableRecordActionsOptions {
  return {
    ...selectWorkTableMutationState(activeTable, state),
    activeRecords,
    canReorderRecords,
    draggedRecordId: state.dragState.draggedRecordId,
    folderSelectedFileId: state.folderState.folderSelectedFileId,
    roomId,
    setDraggedRecordId: state.dragState.setDraggedRecordId,
    setExpandedHistoryRecordIds: state.gridUiState.setExpandedHistoryRecordIds,
    setFolderModal: state.folderState.setFolderModal,
    setFolderPreviewError: state.folderState.setFolderPreviewError,
    setFolderSelectedFileId: state.folderState.setFolderSelectedFileId,
    setRecordContextMenu: state.gridUiState.setRecordContextMenu,
    setUploadingCellKey: state.folderState.setUploadingCellKey,
  };
}
