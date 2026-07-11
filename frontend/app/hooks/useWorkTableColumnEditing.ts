import type { Dispatch, SetStateAction } from "react";

import type { WorkTableColumn, WorkTableFieldType } from "../types";
import { updateWorkTableColumn } from "./workTablesApi";
import { replaceColumn, updatedWorkTableColumnInput, updateTableColumns } from "./workTableColumnUtils";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { WorkTableMutationState } from "./workTableMutationUtils";

export type UseWorkTableColumnEditingOptions = WorkTableMutationState & {
  editingColumn: WorkTableColumn | null;
  editingColumnName: string;
  editingColumnOptions: string;
  editingColumnType: WorkTableFieldType;
  setEditingColumn: Dispatch<SetStateAction<WorkTableColumn | null>>;
  setEditingColumnName: Dispatch<SetStateAction<string>>;
  setEditingColumnOptions: Dispatch<SetStateAction<string>>;
  setEditingColumnType: Dispatch<SetStateAction<WorkTableFieldType>>;
};

export function useWorkTableColumnEditing({
  activeTable,
  editingColumn,
  editingColumnName,
  editingColumnOptions,
  editingColumnType,
  saving,
  setEditingColumn,
  setEditingColumnName,
  setEditingColumnOptions,
  setEditingColumnType,
  setError,
  setSaving,
  setTables,
}: UseWorkTableColumnEditingOptions) {
  function openColumnEditor(column: WorkTableColumn) {
    setEditingColumn(column);
    setEditingColumnName(column.name);
    setEditingColumnType(column.field_type);
    setEditingColumnOptions(column.options.join(", "));
  }

  async function saveColumnEditor() {
    if (!activeTable || !editingColumn || !editingColumnName.trim() || saving) {
      return;
    }

    await runWorkTableMutation({ fallbackError: "列を更新できませんでした。", setError, setSaving }, async () => {
      const updated = await updateWorkTableColumn(
        activeTable.id,
        editingColumn.id,
        updatedWorkTableColumnInput({
          name: editingColumnName,
          fieldType: editingColumnType,
          options: editingColumnOptions,
        }),
      );
      setTables((current) =>
        updateTableColumns(current, activeTable.id, (columns) => replaceColumn(columns, updated))
      );
      setEditingColumn(null);
    });
  }

  return { openColumnEditor, saveColumnEditor };
}
