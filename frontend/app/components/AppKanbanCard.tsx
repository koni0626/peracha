import type { Dispatch, SetStateAction } from "react";

import type { WorkTableRecord } from "../types";

type AppKanbanCardProps = {
  draggedRecordId: string | null;
  record: WorkTableRecord;
  onOpenRecord: (record: WorkTableRecord) => void;
  recordTitle: (record: WorkTableRecord) => string;
  setDraggedRecordId: Dispatch<SetStateAction<string | null>>;
  setDragOverStatus: Dispatch<SetStateAction<string | null>>;
};

export function AppKanbanCard({
  draggedRecordId,
  record,
  onOpenRecord,
  recordTitle,
  setDraggedRecordId,
  setDragOverStatus,
}: AppKanbanCardProps) {
  return (
    <article
      className={`kanbanCard ${draggedRecordId === record.id ? "isDragging" : ""}`}
      draggable
      onClick={() => onOpenRecord(record)}
      onDragStart={(event) => {
        setDraggedRecordId(record.id);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", record.id);
      }}
      onDragEnd={() => {
        setDraggedRecordId(null);
        setDragOverStatus(null);
      }}
    >
      {recordTitle(record)}
    </article>
  );
}
