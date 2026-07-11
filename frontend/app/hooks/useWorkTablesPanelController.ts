import { useWorkTablePanelActions } from "./useWorkTablePanelActions";
import { useWorkTablePanelUiBindings } from "./useWorkTablePanelUiBindings";
import { useWorkTableRoomData } from "./useWorkTableRoomData";
import { useWorkTableViewState } from "./useWorkTableViewState";
import { useWorkTablesPanelState } from "./useWorkTablesPanelState";
import type { User } from "../types";

export function useWorkTablesPanelController(roomId: string | null, userOptions: User[]) {
  const state = useWorkTablesPanelState();
  const keyword = "";

  const { loading } = useWorkTableRoomData({
    roomId,
    setActiveTableId: state.setActiveTableId,
    setError: state.setError,
    setTables: state.setTables,
  });
  const { activeRecords, activeTable, canReorderRecords, filteredRecords } = useWorkTableViewState({
    activeTableId: state.activeTableId,
    columnFilters: state.columnFilters,
    keyword,
    sortState: state.sortState,
    tables: state.tables,
  });
  const { columnActions, recordActions, tableActions } = useWorkTablePanelActions({
    activeRecords,
    activeTable,
    canReorderRecords,
    roomId,
    state,
  });
  const { cellRenderers, gridControls, menuState } = useWorkTablePanelUiBindings({
    activeRecords,
    activeTable,
    recordActions,
    state,
    userOptions,
  });

  return {
    activeRecords,
    activeTable,
    canReorderRecords,
    cellRenderers,
    columnActions,
    filteredRecords,
    gridControls,
    loading,
    menuState,
    recordActions,
    state,
    tableActions,
  };
}

export type WorkTablesPanelController = ReturnType<typeof useWorkTablesPanelController>;
