import type { DragEvent } from "react";

import type { WorkTableColumn } from "../types";

type ColumnDragHandlersOptions = {
  column: WorkTableColumn;
  draggedColumnId: string | null;
  dropColumn: (columnId: string) => void | Promise<void>;
  setDraggedColumnId: (columnId: string | null) => void;
};

export function workTableColumnDragClass(columnId: string, draggedColumnId: string | null) {
  return draggedColumnId === columnId ? "isDraggingColumn" : "";
}

export function workTableColumnDragHandlers({
  column,
  draggedColumnId,
  dropColumn,
  setDraggedColumnId,
}: ColumnDragHandlersOptions) {
  return {
    draggable: true,
    onDragStart(event: DragEvent<HTMLTableCellElement>) {
      setDraggedColumnId(column.id);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", column.id);
    },
    onDragEnd() {
      setDraggedColumnId(null);
    },
    onDragOver(event: DragEvent<HTMLTableCellElement>) {
      if (draggedColumnId) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }
    },
    onDrop(event: DragEvent<HTMLTableCellElement>) {
      event.preventDefault();
      void dropColumn(column.id);
    },
  };
}
