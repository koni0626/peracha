import type { Dispatch, SetStateAction } from "react";

import { createRoomWorkTable } from "./workTablesApi";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { WorkTableListMutationState } from "./workTableMutationUtils";

type UseWorkTableCreationOptions = WorkTableListMutationState & {
  roomId: string | null;
  tableName: string;
  setActiveTableId: Dispatch<SetStateAction<string | null>>;
  setCreatingTable: Dispatch<SetStateAction<boolean>>;
  setTableName: Dispatch<SetStateAction<string>>;
};

export function useWorkTableCreation({
  roomId,
  saving,
  tableName,
  tables,
  setActiveTableId,
  setCreatingTable,
  setError,
  setSaving,
  setTableName,
  setTables,
}: UseWorkTableCreationOptions) {
  async function addTable() {
    if (!roomId || !tableName.trim() || saving) {
      return;
    }
    const name = tableName.trim();
    if (tables.some((table) => table.name.trim().toLowerCase() === name.toLowerCase())) {
      setError("同じ名前のテーブルは既に存在します");
      return;
    }
    await runWorkTableMutation({ fallbackError: "テーブルを作成できませんでした", setError, setSaving }, async () => {
      const table = await createRoomWorkTable(roomId, name);
      setTables((current) => [...current, table]);
      setActiveTableId(table.id);
      setTableName("");
      setCreatingTable(false);
    });
  }

  return {
    addTable,
  };
}
