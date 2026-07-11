import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableColumn, WorkTableRecord } from "../types";
import { parseProgressPercent } from "../components/appRecordUtils";
import { getErrorMessage } from "./mutationRunner";
import { replaceWorkTable } from "./workTableListUtils";
import { recordWithCellValue, replaceRecordInTables, replaceTableRecord } from "./workTableRecordUtils";
import { createWorkTableRecordHistory, updateWorkTableRecord } from "./workTablesApi";

type UseAppGanttProgressOptions = {
  progressColumn: WorkTableColumn | null;
  selectedTable: WorkTable | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
  tables: WorkTable[];
};

export function useAppGanttProgress({
  progressColumn,
  selectedTable,
  setError,
  setTables,
  tables,
}: UseAppGanttProgressOptions) {
  async function updateGanttProgress(record: WorkTableRecord, progress: number) {
    if (!selectedTable || !progressColumn) {
      return;
    }
    const nextProgress = Math.max(0, Math.min(100, Math.round(progress)));
    if (parseProgressPercent(record.values[progressColumn.id]) === nextProgress) {
      return;
    }
    const previousTables = tables;
    const optimisticRecord = recordWithCellValue(record, progressColumn, nextProgress);
    setTables((current) => replaceRecordInTables(current, selectedTable.id, record.id, optimisticRecord));
    setError(null);

    try {
      const tableWithHistory = await createWorkTableRecordHistory(selectedTable.id, record.id);
      const updated = await updateWorkTableRecord(selectedTable.id, record.id, { [progressColumn.id]: nextProgress });
      const nextTable = replaceTableRecord(tableWithHistory, updated.id, updated);
      setTables((current) => replaceWorkTable(current, nextTable));
    } catch (err) {
      setTables(previousTables);
      setError(getErrorMessage(err, "ガントチャートの進捗率を保存できませんでした。"));
    }
  }

  return { updateGanttProgress };
}
