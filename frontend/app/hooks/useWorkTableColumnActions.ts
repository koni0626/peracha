import { useWorkTableColumnCreation } from "./useWorkTableColumnCreation";
import { useWorkTableColumnDeletion } from "./useWorkTableColumnDeletion";
import { useWorkTableColumnEditing } from "./useWorkTableColumnEditing";
import { useWorkTableColumnOrdering } from "./useWorkTableColumnOrdering";
import {
  selectColumnCreationOptions,
  selectColumnDeletionOptions,
  selectColumnEditingOptions,
  selectColumnOrderingOptions,
} from "./workTableColumnActionOptionSelectors";
import type { UseWorkTableColumnActionsOptions } from "./workTableColumnActionTypes";

export function useWorkTableColumnActions(options: UseWorkTableColumnActionsOptions) {
  const columnCreation = useWorkTableColumnCreation(selectColumnCreationOptions(options));
  const columnEditing = useWorkTableColumnEditing(selectColumnEditingOptions(options));
  const columnOrdering = useWorkTableColumnOrdering(selectColumnOrderingOptions(options));
  const columnDeletion = useWorkTableColumnDeletion(selectColumnDeletionOptions(options));

  return {
    dropColumn: columnOrdering.dropColumn,
    openColumnCreator: columnCreation.openColumnCreator,
    openColumnEditor: columnEditing.openColumnEditor,
    removeColumn: columnDeletion.removeColumn,
    saveColumnEditor: columnEditing.saveColumnEditor,
    saveColumnOrder: columnOrdering.saveColumnOrder,
    saveNewColumn: columnCreation.saveNewColumn,
  };
}
