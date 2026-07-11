import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableColumn } from "../types";
import { movableKanbanRecord, optimisticKanbanRecord, shouldMoveKanbanRecord } from "./appKanbanMoveUtils";
import { getErrorMessage } from "./mutationRunner";
import { replaceRecordInTables } from "./workTableRecordUtils";
import { updateWorkTableRecord } from "./workTablesApi";

type UseAppKanbanMoverOptions = {
  selectedTable: WorkTable | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
  statusColumn: WorkTableColumn | null;
  tables: WorkTable[];
};

export function useAppKanbanMover({ selectedTable, setError, setTables, statusColumn, tables }: UseAppKanbanMoverOptions) {
  const [draggedKanbanRecordId, setDraggedKanbanRecordId] = useState<string | null>(null);
  const [dragOverKanbanStatus, setDragOverKanbanStatus] = useState<string | null>(null);

  async function moveKanbanRecord(recordId: string, nextStatus: string) {
    if (!selectedTable || !statusColumn) {
      return;
    }
    const record = movableKanbanRecord(selectedTable, recordId);
    if (!record) {
      return;
    }
    setDraggedKanbanRecordId(null);
    setDragOverKanbanStatus(null);
    if (!shouldMoveKanbanRecord(record, statusColumn, nextStatus)) {
      return;
    }

    const previousTables = tables;
    const optimisticRecord = optimisticKanbanRecord(record, statusColumn, nextStatus);
    setTables((current) => replaceRecordInTables(current, selectedTable.id, record.id, optimisticRecord));
    setError(null);
    try {
      const updated = await updateWorkTableRecord(selectedTable.id, record.id, { [statusColumn.id]: nextStatus });
      setTables((current) => replaceRecordInTables(current, selectedTable.id, updated.id, updated));
    } catch (err) {
      setTables(previousTables);
      setError(getErrorMessage(err, "カンバンの状態を更新できませんでした。"));
    }
  }

  return {
    dragOverKanbanStatus,
    draggedKanbanRecordId,
    moveKanbanRecord,
    setDragOverKanbanStatus,
    setDraggedKanbanRecordId,
  };
}
