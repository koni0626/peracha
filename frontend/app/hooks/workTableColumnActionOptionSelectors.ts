import type { UseWorkTableColumnActionsOptions } from "./workTableColumnActionTypes";
import type { UseWorkTableColumnCreationOptions } from "./useWorkTableColumnCreation";
import type { UseWorkTableColumnDeletionOptions } from "./useWorkTableColumnDeletion";
import type { UseWorkTableColumnEditingOptions } from "./useWorkTableColumnEditing";
import type { UseWorkTableColumnOrderingOptions } from "./useWorkTableColumnOrdering";
import type { WorkTableMutationState } from "./workTableMutationUtils";

function selectColumnMutationState({
  activeTable,
  saving,
  setError,
  setSaving,
  setTables,
}: UseWorkTableColumnActionsOptions): WorkTableMutationState {
  return {
    activeTable,
    saving,
    setError,
    setSaving,
    setTables,
  };
}

export function selectColumnCreationOptions(
  options: UseWorkTableColumnActionsOptions
): UseWorkTableColumnCreationOptions {
  return {
    ...selectColumnMutationState(options),
    creatingColumnAt: options.creatingColumnAt,
    newColumnName: options.newColumnName,
    newColumnOptions: options.newColumnOptions,
    newColumnType: options.newColumnType,
    setColumnContextMenu: options.setColumnContextMenu,
    setCreatingColumnAt: options.setCreatingColumnAt,
    setNewColumnName: options.setNewColumnName,
    setNewColumnOptions: options.setNewColumnOptions,
    setNewColumnType: options.setNewColumnType,
  };
}

export function selectColumnEditingOptions(
  options: UseWorkTableColumnActionsOptions
): UseWorkTableColumnEditingOptions {
  return {
    ...selectColumnMutationState(options),
    editingColumn: options.editingColumn,
    editingColumnName: options.editingColumnName,
    editingColumnOptions: options.editingColumnOptions,
    editingColumnType: options.editingColumnType,
    setEditingColumn: options.setEditingColumn,
    setEditingColumnName: options.setEditingColumnName,
    setEditingColumnOptions: options.setEditingColumnOptions,
    setEditingColumnType: options.setEditingColumnType,
  };
}

export function selectColumnOrderingOptions(
  options: UseWorkTableColumnActionsOptions
): UseWorkTableColumnOrderingOptions {
  return {
    ...selectColumnMutationState(options),
    draggedColumnId: options.draggedColumnId,
    setDraggedColumnId: options.setDraggedColumnId,
  };
}

export function selectColumnDeletionOptions(
  options: UseWorkTableColumnActionsOptions
): UseWorkTableColumnDeletionOptions {
  return {
    ...selectColumnMutationState(options),
    setColumnFilters: options.setColumnFilters,
    setSortState: options.setSortState,
  };
}
