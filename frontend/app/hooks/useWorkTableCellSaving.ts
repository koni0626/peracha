import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableColumn, WorkTableRecord, WorkTableRecordValue } from "../types";
import { parseValue } from "../components/workTableValueUtils";
import { getErrorMessage } from "./mutationRunner";
import { isSameRecordValue, recordCellPatch, recordWithCellValue, replaceRecordInTables } from "./workTableRecordUtils";
import { updateWorkTableRecord } from "./workTablesApi";

export type UseWorkTableCellSavingOptions = {
  activeTable: WorkTable | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
};

export function useWorkTableCellSaving({ activeTable, setError, setTables }: UseWorkTableCellSavingOptions) {
  async function saveCell(record: WorkTableRecord, column: WorkTableColumn, rawValue: string) {
    await saveCellValue(record, column, parseValue(column, rawValue));
  }

  async function saveCellValue(record: WorkTableRecord, column: WorkTableColumn, nextValue: WorkTableRecordValue) {
    if (!activeTable) {
      return;
    }
    if (isSameRecordValue(record.values[column.id], nextValue)) {
      return;
    }
    setError(null);
    const optimisticRecord = recordWithCellValue(record, column, nextValue);
    setTables((current) => replaceRecordInTables(current, activeTable.id, record.id, optimisticRecord));
    try {
      const updated = await updateWorkTableRecord(activeTable.id, record.id, recordCellPatch(column, nextValue));
      setTables((current) => replaceRecordInTables(current, activeTable.id, record.id, updated));
    } catch (err) {
      setError(getErrorMessage(err, "セルを保存できませんでした"));
    }
  }

  return {
    saveCell,
    saveCellValue,
  };
}
