import type { Dispatch, SetStateAction } from "react";

import type { WorkTableRecord } from "../types";
import { toggleId } from "./idListUtils";
import { createWorkTableRecordHistory } from "./workTablesApi";
import { replaceWorkTable } from "./workTableListUtils";
import { runWorkTableMutation } from "./workTableMutationUtils";
import type { WorkTableMutationState } from "./workTableMutationUtils";

export type UseWorkTableRecordHistoryOptions = WorkTableMutationState & {
  setExpandedHistoryRecordIds: Dispatch<SetStateAction<string[]>>;
};

export function useWorkTableRecordHistory({
  activeTable,
  saving,
  setError,
  setExpandedHistoryRecordIds,
  setSaving,
  setTables,
}: UseWorkTableRecordHistoryOptions) {
  async function addRecordHistory(record: WorkTableRecord) {
    if (!activeTable || saving) {
      return;
    }
    await runWorkTableMutation({ fallbackError: "履歴を作成できませんでした", setError, setSaving }, async () => {
      const updated = await createWorkTableRecordHistory(activeTable.id, record.id);
      setTables((current) => replaceWorkTable(current, updated));
      setExpandedHistoryRecordIds((current) => (current.includes(record.id) ? current : [...current, record.id]));
    });
  }

  function toggleRecordHistories(record: WorkTableRecord, histories: WorkTableRecord[]) {
    if (histories.length === 0) {
      void addRecordHistory(record);
      return;
    }
    setExpandedHistoryRecordIds((current) => toggleId(current, record.id));
  }

  return { addRecordHistory, toggleRecordHistories };
}
