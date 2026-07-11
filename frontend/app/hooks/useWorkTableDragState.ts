import { useState } from "react";

export function useWorkTableDragState() {
  const [draggedTableId, setDraggedTableId] = useState<string | null>(null);
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [draggedRecordId, setDraggedRecordId] = useState<string | null>(null);

  return {
    draggedColumnId,
    draggedRecordId,
    draggedTableId,
    setDraggedColumnId,
    setDraggedRecordId,
    setDraggedTableId,
  };
}
