import type { UseWorkTableTableActionsOptions } from "./useWorkTableTableActions";
import type { WorkTablesPanelState } from "./workTablePanelActionSelectorTypes";
import { selectWorkTableListMutationState } from "./workTablePanelMutationSelectors";

export function selectWorkTableTableActionOptions(
  roomId: string | null,
  state: WorkTablesPanelState
): UseWorkTableTableActionsOptions {
  return {
    ...selectWorkTableListMutationState(state),
    activeTableId: state.activeTableId,
    draggedTableId: state.dragState.draggedTableId,
    roomId,
    tableName: state.tableName,
    setActiveTableId: state.setActiveTableId,
    setColumnFilters: state.gridUiState.setColumnFilters,
    setCreatingTable: state.setCreatingTable,
    setDraggedTableId: state.dragState.setDraggedTableId,
    setOpenFilterMenu: state.gridUiState.setOpenFilterMenu,
    setSortState: state.gridUiState.setSortState,
    setTableName: state.setTableName,
  };
}
