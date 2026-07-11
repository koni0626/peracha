import type { User, WorkTable, WorkTableRecord } from "../types";
import { useWorkTableCellRenderers } from "./useWorkTableCellRenderers";
import { useWorkTableGridControls } from "./useWorkTableGridControls";
import { useWorkTableMenuState } from "./useWorkTableMenuState";
import type { useWorkTableRecordActions } from "./useWorkTableRecordActions";
import type { useWorkTablesPanelState } from "./useWorkTablesPanelState";

type UseWorkTablePanelUiBindingsOptions = {
  activeRecords: WorkTableRecord[];
  activeTable: WorkTable | null;
  recordActions: ReturnType<typeof useWorkTableRecordActions>;
  state: ReturnType<typeof useWorkTablesPanelState>;
  userOptions: User[];
};

export function useWorkTablePanelUiBindings({
  activeRecords,
  activeTable,
  recordActions,
  state,
  userOptions,
}: UseWorkTablePanelUiBindingsOptions) {
  const gridControls = useWorkTableGridControls({
    activeRecords,
    activeTable,
    columnFilters: state.columnFilters,
    setColumnFilters: state.setColumnFilters,
    setOpenFilterMenu: state.setOpenFilterMenu,
    setSortState: state.setSortState,
  });
  const menuState = useWorkTableMenuState({
    activeTableId: activeTable?.id ?? null,
    setColumnContextMenu: state.setColumnContextMenu,
    setExpandedHistoryRecordIds: state.setExpandedHistoryRecordIds,
    setOpenFilterMenu: state.setOpenFilterMenu,
    setRecordContextMenu: state.setRecordContextMenu,
  });
  const cellRenderers = useWorkTableCellRenderers({
    uploadingCellKey: state.uploadingCellKey,
    cellKey: recordActions.cellKey,
    openFolderCell: recordActions.openFolderCell,
    saveCell: recordActions.saveCell,
    uploadCellFile: recordActions.uploadCellFile,
    uploadFolderFiles: recordActions.uploadFolderFiles,
    userOptions,
  });

  return {
    cellRenderers,
    gridControls,
    menuState,
  };
}
