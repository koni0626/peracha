import type { WorkTable } from "../types";
import type { UseWorkTableColumnActionsOptions } from "./workTableColumnActionTypes";
import type { WorkTablesPanelState } from "./workTablePanelActionSelectorTypes";
import { selectWorkTableMutationState } from "./workTablePanelMutationSelectors";

export function selectWorkTableColumnActionOptions(
  activeTable: WorkTable | null,
  state: WorkTablesPanelState
): UseWorkTableColumnActionsOptions {
  return {
    ...selectWorkTableMutationState(activeTable, state),
    creatingColumnAt: state.columnForm.creatingColumnAt,
    draggedColumnId: state.dragState.draggedColumnId,
    editingColumn: state.columnForm.editingColumn,
    editingColumnName: state.columnForm.editingColumnName,
    editingColumnOptions: state.columnForm.editingColumnOptions,
    editingColumnType: state.columnForm.editingColumnType,
    newColumnName: state.columnForm.newColumnName,
    newColumnOptions: state.columnForm.newColumnOptions,
    newColumnType: state.columnForm.newColumnType,
    setColumnContextMenu: state.gridUiState.setColumnContextMenu,
    setColumnFilters: state.gridUiState.setColumnFilters,
    setCreatingColumnAt: state.columnForm.setCreatingColumnAt,
    setDraggedColumnId: state.dragState.setDraggedColumnId,
    setEditingColumn: state.columnForm.setEditingColumn,
    setEditingColumnName: state.columnForm.setEditingColumnName,
    setEditingColumnOptions: state.columnForm.setEditingColumnOptions,
    setEditingColumnType: state.columnForm.setEditingColumnType,
    setNewColumnName: state.columnForm.setNewColumnName,
    setNewColumnOptions: state.columnForm.setNewColumnOptions,
    setNewColumnType: state.columnForm.setNewColumnType,
    setSortState: state.gridUiState.setSortState,
  };
}
