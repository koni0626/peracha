import type { WorkTablesPanelController } from "../hooks/useWorkTablesPanelController";
import type { WorkTableWorkspaceProps } from "./WorkTableWorkspace";

export function selectWorkTableWorkspaceProps(
  controller: WorkTablesPanelController,
  roomId: string | null
): WorkTableWorkspaceProps | null {
  const {
    activeRecords,
    activeTable,
    canReorderRecords,
    cellRenderers,
    columnActions,
    filteredRecords,
    gridControls,
    menuState,
    recordActions,
    state,
    tableActions,
  } = controller;
  const { dragState, gridUiState } = state;

  if (!activeTable) {
    return null;
  }

  return {
    activeFilterCount: gridControls.activeFilterCount,
    activeRecords,
    activeTable,
    canReorderRecords,
    columnContextMenu: gridUiState.columnContextMenu,
    columnFilters: gridUiState.columnFilters,
    creatingTable: state.creatingTable,
    draggedColumnId: dragState.draggedColumnId,
    draggedRecordId: dragState.draggedRecordId,
    draggedTableId: dragState.draggedTableId,
    expandedHistoryRecordIds: gridUiState.expandedHistoryRecordIds,
    filteredRecords,
    openFilterMenu: gridUiState.openFilterMenu,
    recordContextMenu: gridUiState.recordContextMenu,
    roomId,
    saving: state.saving,
    sortState: gridUiState.sortState,
    tableName: state.tableName,
    tables: state.tables,
    addTable: tableActions.addTable,
    dropColumn: columnActions.dropColumn,
    dropRecord: recordActions.dropRecord,
    dropTable: tableActions.dropTable,
    formatHistoryTime: gridControls.formatHistoryTime,
    insertRecordAt: recordActions.insertRecordAt,
    insertRecordNear: recordActions.insertRecordNear,
    openColumnContextMenu: menuState.openColumnContextMenu,
    openColumnCreator: columnActions.openColumnCreator,
    openColumnEditor: columnActions.openColumnEditor,
    openEmptyRecordContextMenu: menuState.openEmptyRecordContextMenu,
    openRecordContextMenu: menuState.openRecordContextMenu,
    recordHistories: gridControls.recordHistories,
    removeColumn: columnActions.removeColumn,
    removeTable: tableActions.removeTable,
    renderCell: cellRenderers.renderCell,
    renderReadonlyCell: cellRenderers.renderReadonlyCell,
    setActiveTableId: state.setActiveTableId,
    setColumnFilters: gridUiState.setColumnFilters,
    setCreatingTable: state.setCreatingTable,
    setDraggedColumnId: dragState.setDraggedColumnId,
    setDraggedRecordId: dragState.setDraggedRecordId,
    setDraggedTableId: dragState.setDraggedTableId,
    setOpenFilterMenu: gridUiState.setOpenFilterMenu,
    setTableName: state.setTableName,
    toggleFilterMenu: gridControls.toggleFilterMenu,
    toggleFilterValue: gridControls.toggleFilterValue,
    toggleRecordHistories: recordActions.toggleRecordHistories,
    toggleSort: gridControls.toggleSort,
    uniqueColumnValues: gridControls.uniqueColumnValues,
  };
}
