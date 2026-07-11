import type { DragEvent } from "react";

type WorkTableRecordDragOptions = {
  canReorderRecords: boolean;
  draggedRecordId: string | null;
  dropRecord: (recordId: string) => void | Promise<void>;
  recordId: string;
  setDraggedRecordId: (recordId: string | null) => void;
};

export function workTableRecordRowClass(recordId: string, draggedRecordId: string | null, historiesExpanded: boolean) {
  return `${draggedRecordId === recordId ? "isDraggingRecord" : ""} ${historiesExpanded ? "hasExpandedHistory" : ""}`;
}

export function workTableRecordDragTitle(canReorderRecords: boolean) {
  return canReorderRecords ? "ドラッグで行を移動" : "検索・ソート・絞り込み中は行を移動できません";
}

export function workTableRecordDragHandlers({
  canReorderRecords,
  draggedRecordId,
  dropRecord,
  recordId,
  setDraggedRecordId,
}: WorkTableRecordDragOptions) {
  return {
    draggable: canReorderRecords,
    onDragStart(event: DragEvent<HTMLTableRowElement>) {
      if (!canReorderRecords) {
        event.preventDefault();
        return;
      }
      setDraggedRecordId(recordId);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", recordId);
    },
    onDragEnd() {
      setDraggedRecordId(null);
    },
    onDragOver(event: DragEvent<HTMLTableRowElement>) {
      if (draggedRecordId && canReorderRecords) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }
    },
    onDrop(event: DragEvent<HTMLTableRowElement>) {
      event.preventDefault();
      void dropRecord(recordId);
    },
  };
}
