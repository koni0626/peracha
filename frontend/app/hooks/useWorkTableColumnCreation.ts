import type { Dispatch, SetStateAction } from "react";

import type { WorkTableColumn, WorkTableFieldType } from "../types";
import { createWorkTableColumn } from "./workTablesApi";
import { columnInsertPosition, insertColumn, newWorkTableColumnInput, updateTableColumns } from "./workTableColumnUtils";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { WorkTableMutationState } from "./workTableMutationUtils";

export type UseWorkTableColumnCreationOptions = WorkTableMutationState & {
  creatingColumnAt: number | null;
  newColumnName: string;
  newColumnOptions: string;
  newColumnType: WorkTableFieldType;
  setColumnContextMenu: Dispatch<SetStateAction<{ columnId: string; x: number; y: number } | null>>;
  setCreatingColumnAt: Dispatch<SetStateAction<number | null>>;
  setNewColumnName: Dispatch<SetStateAction<string>>;
  setNewColumnOptions: Dispatch<SetStateAction<string>>;
  setNewColumnType: Dispatch<SetStateAction<WorkTableFieldType>>;
};

export function useWorkTableColumnCreation({
  activeTable,
  creatingColumnAt,
  newColumnName,
  newColumnOptions,
  newColumnType,
  saving,
  setColumnContextMenu,
  setCreatingColumnAt,
  setError,
  setNewColumnName,
  setNewColumnOptions,
  setNewColumnType,
  setSaving,
  setTables,
}: UseWorkTableColumnCreationOptions) {
  function resetNewColumnForm() {
    setNewColumnName("");
    setNewColumnType("text");
    setNewColumnOptions("");
  }

  function openColumnCreator(column: WorkTableColumn, side: "left" | "right") {
    if (!activeTable) {
      return;
    }
    const insertPosition = columnInsertPosition(activeTable.columns, column.id, side);
    if (insertPosition === null) {
      return;
    }
    setCreatingColumnAt(insertPosition);
    resetNewColumnForm();
    setColumnContextMenu(null);
  }

  async function saveNewColumn() {
    if (!activeTable || creatingColumnAt === null || !newColumnName.trim() || saving) {
      return;
    }

    const insertPosition = creatingColumnAt;
    await runWorkTableMutation({ fallbackError: "列を作成できませんでした。", setError, setSaving }, async () => {
      const column = await createWorkTableColumn(
        activeTable.id,
        newWorkTableColumnInput({
          name: newColumnName,
          fieldType: newColumnType,
          options: newColumnOptions,
          position: insertPosition,
        }),
      );
      setTables((current) =>
        updateTableColumns(current, activeTable.id, (columns) => insertColumn(columns, column, insertPosition))
      );
      setCreatingColumnAt(null);
      resetNewColumnForm();
    });
  }

  return { openColumnCreator, saveNewColumn };
}
