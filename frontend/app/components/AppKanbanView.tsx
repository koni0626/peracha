import type { Dispatch, SetStateAction } from "react";

import type { WorkTableColumn, WorkTableRecord } from "../types";
import { AppKanbanColumn } from "./AppKanbanColumn";
import { kanbanStatuses, recordsForKanbanStatus } from "./appKanbanModel";

type AppKanbanViewProps = {
  draggedRecordId: string | null;
  dragOverStatus: string | null;
  records: WorkTableRecord[];
  statusColumn: WorkTableColumn | null;
  moveRecord: (recordId: string, nextStatus: string) => void | Promise<void>;
  onOpenRecord: (record: WorkTableRecord) => void;
  recordTitle: (record: WorkTableRecord) => string;
  setDraggedRecordId: Dispatch<SetStateAction<string | null>>;
  setDragOverStatus: Dispatch<SetStateAction<string | null>>;
};

export function AppKanbanView({
  draggedRecordId,
  dragOverStatus,
  records,
  statusColumn,
  moveRecord,
  onOpenRecord,
  recordTitle,
  setDraggedRecordId,
  setDragOverStatus,
}: AppKanbanViewProps) {
  if (!statusColumn) {
    return <p className="appViewEmpty">状態に使う選択肢列を指定してください。</p>;
  }

  const statuses = kanbanStatuses(records, statusColumn);

  return (
    <div className="kanbanView">
      {statuses.map((status) => {
        const columnRecords = recordsForKanbanStatus(records, statusColumn, status);
        return (
          <AppKanbanColumn
            draggedRecordId={draggedRecordId}
            dragOverStatus={dragOverStatus}
            key={status}
            records={columnRecords}
            status={status}
            moveRecord={moveRecord}
            onOpenRecord={onOpenRecord}
            recordTitle={recordTitle}
            setDraggedRecordId={setDraggedRecordId}
            setDragOverStatus={setDragOverStatus}
          />
        );
      })}
    </div>
  );
}
