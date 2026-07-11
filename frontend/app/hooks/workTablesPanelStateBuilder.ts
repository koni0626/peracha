import type { Dispatch, SetStateAction } from "react";

import type { WorkTable } from "../types";
import type { useWorkTableColumnFormState } from "./useWorkTableColumnFormState";
import type { useWorkTableDragState } from "./useWorkTableDragState";
import type { useWorkTableFolderModalState } from "./useWorkTableFolderModalState";
import type { useWorkTableGridUiState } from "./useWorkTableGridUiState";

type BuildWorkTablesPanelStateOptions = {
  activeTableId: string | null;
  columnForm: ReturnType<typeof useWorkTableColumnFormState>;
  creatingTable: boolean;
  dragState: ReturnType<typeof useWorkTableDragState>;
  error: string | null;
  folderState: ReturnType<typeof useWorkTableFolderModalState>;
  gridUiState: ReturnType<typeof useWorkTableGridUiState>;
  saving: boolean;
  tableName: string;
  tables: WorkTable[];
  setActiveTableId: Dispatch<SetStateAction<string | null>>;
  setCreatingTable: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setSaving: Dispatch<SetStateAction<boolean>>;
  setTableName: Dispatch<SetStateAction<string>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
};

export function buildWorkTablesPanelState({
  activeTableId,
  columnForm,
  creatingTable,
  dragState,
  error,
  folderState,
  gridUiState,
  saving,
  tableName,
  tables,
  setActiveTableId,
  setCreatingTable,
  setError,
  setSaving,
  setTableName,
  setTables,
}: BuildWorkTablesPanelStateOptions) {
  return {
    activeTableId,
    columnForm,
    columnContextMenu: gridUiState.columnContextMenu,
    columnFilters: gridUiState.columnFilters,
    creatingColumnAt: columnForm.creatingColumnAt,
    creatingTable,
    draggedColumnId: dragState.draggedColumnId,
    draggedRecordId: dragState.draggedRecordId,
    draggedTableId: dragState.draggedTableId,
    editingColumn: columnForm.editingColumn,
    editingColumnName: columnForm.editingColumnName,
    editingColumnOptions: columnForm.editingColumnOptions,
    editingColumnType: columnForm.editingColumnType,
    error,
    dragState,
    expandedHistoryRecordIds: gridUiState.expandedHistoryRecordIds,
    folderState,
    folderModal: folderState.folderModal,
    folderPreviewError: folderState.folderPreviewError,
    folderSelectedFileId: folderState.folderSelectedFileId,
    newColumnName: columnForm.newColumnName,
    newColumnOptions: columnForm.newColumnOptions,
    newColumnType: columnForm.newColumnType,
    gridUiState,
    openFilterMenu: gridUiState.openFilterMenu,
    recordContextMenu: gridUiState.recordContextMenu,
    saving,
    sortState: gridUiState.sortState,
    tableName,
    tables,
    uploadingCellKey: folderState.uploadingCellKey,
    setActiveTableId,
    setColumnContextMenu: gridUiState.setColumnContextMenu,
    setColumnFilters: gridUiState.setColumnFilters,
    setCreatingColumnAt: columnForm.setCreatingColumnAt,
    setCreatingTable,
    setDraggedColumnId: dragState.setDraggedColumnId,
    setDraggedRecordId: dragState.setDraggedRecordId,
    setDraggedTableId: dragState.setDraggedTableId,
    setEditingColumn: columnForm.setEditingColumn,
    setEditingColumnName: columnForm.setEditingColumnName,
    setEditingColumnOptions: columnForm.setEditingColumnOptions,
    setEditingColumnType: columnForm.setEditingColumnType,
    setError,
    setExpandedHistoryRecordIds: gridUiState.setExpandedHistoryRecordIds,
    setFolderModal: folderState.setFolderModal,
    setFolderPreviewError: folderState.setFolderPreviewError,
    setFolderSelectedFileId: folderState.setFolderSelectedFileId,
    setNewColumnName: columnForm.setNewColumnName,
    setNewColumnOptions: columnForm.setNewColumnOptions,
    setNewColumnType: columnForm.setNewColumnType,
    setOpenFilterMenu: gridUiState.setOpenFilterMenu,
    setRecordContextMenu: gridUiState.setRecordContextMenu,
    setSaving,
    setSortState: gridUiState.setSortState,
    setTableName,
    setTables,
    setUploadingCellKey: folderState.setUploadingCellKey,
  };
}
