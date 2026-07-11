import type { WorkTableRecord } from "../types";
import { createWorkTableRecord } from "./workTablesApi";
import { insertActiveRecord, recordInsertPosition, updateTableRecords } from "./workTableRecordUtils";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { UseWorkTableRecordInsertionOptions } from "./workTableRecordOrderingTypes";

export function useWorkTableRecordInsertion({
  activeRecords,
  activeTable,
  saving,
  setError,
  setRecordContextMenu,
  setSaving,
  setTables,
}: UseWorkTableRecordInsertionOptions) {
  async function insertRecordAt(insertPosition: number) {
    if (!activeTable || saving) {
      return;
    }

    setRecordContextMenu(null);
    await runWorkTableMutation({ fallbackError: "行を作成できませんでした。", setError, setSaving }, async () => {
      const created = await createWorkTableRecord(activeTable.id, {}, insertPosition);
      setTables((current) =>
        updateTableRecords(current, activeTable.id, (records) => insertActiveRecord(records, created, insertPosition))
      );
    });
  }

  async function insertRecordNear(record: WorkTableRecord, side: "above" | "below") {
    const insertPosition = recordInsertPosition(activeRecords, record.id, side);
    if (insertPosition === null) {
      return;
    }
    await insertRecordAt(insertPosition);
  }

  return {
    insertRecordAt,
    insertRecordNear,
  };
}
