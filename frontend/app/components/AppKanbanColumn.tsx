import type { Dispatch, SetStateAction } from "react";

import type { WorkTableRecord } from "../types";
import { AppKanbanCard } from "./AppKanbanCard";

type AppKanbanColumnProps = {
  draggedRecordId: string | null;
  dragOverStatus: string | null;
  records: WorkTableRecord[];
  status: string;
  moveRecord: (recordId: string, nextStatus: string) => void | Promise<void>;
  onOpenRecord: (record: WorkTableRecord) => void;
  recordTitle: (record: WorkTableRecord) => string;
  setDraggedRecordId: Dispatch<SetStateAction<string | null>>;
  setDragOverStatus: Dispatch<SetStateAction<string | null>>;
};

export function AppKanbanColumn({
  draggedRecordId,
  dragOverStatus,
  records,
  status,
  moveRecord,
  onOpenRecord,
  recordTitle,
  setDraggedRecordId,
  setDragOverStatus,
}: AppKanbanColumnProps) {
  return (
    <section
      className={`kanbanColumn ${dragOverStatus === status ? "isDragOver" : ""}`}
      onDragOver={(event) => {
        if (!draggedRecordId) {
          return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDragOverStatus(status);
      }}
      onDragLeave={() => setDragOverStatus((current) => (current === status ? null : current))}
      onDrop={(event) => {
        event.preventDefault();
        if (draggedRecordId) {
          void moveRecord(draggedRecordId, status);
        }
      }}
    >
      <h3>
        {status || "未分類"} <span>{records.length}</span>
      </h3>
      {records.map((record) => (
        <AppKanbanCard
          draggedRecordId={draggedRecordId}
          key={record.id}
          record={record}
          onOpenRecord={onOpenRecord}
          recordTitle={recordTitle}
          setDraggedRecordId={setDraggedRecordId}
          setDragOverStatus={setDragOverStatus}
        />
      ))}
    </section>
  );
}
