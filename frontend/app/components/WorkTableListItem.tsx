import { Table2, Trash2 } from "lucide-react";

import type { WorkTable } from "../types";

type WorkTableListItemProps = {
  active: boolean;
  draggedTableId: string | null;
  saving: boolean;
  table: WorkTable;
  dropTable: (tableId: string) => void | Promise<void>;
  removeTable: (table: WorkTable) => void | Promise<void>;
  setActiveTableId: (tableId: string) => void;
  setDraggedTableId: (tableId: string | null) => void;
};

export function WorkTableListItem({
  active,
  draggedTableId,
  saving,
  table,
  dropTable,
  removeTable,
  setActiveTableId,
  setDraggedTableId,
}: WorkTableListItemProps) {
  return (
    <div
      className={`workTableListItem ${active ? "active" : ""} ${draggedTableId === table.id ? "isDraggingTable" : ""}`}
      draggable
      onDragStart={(event) => {
        setDraggedTableId(table.id);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", table.id);
      }}
      onDragEnd={() => setDraggedTableId(null)}
      onDragOver={(event) => {
        if (draggedTableId) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        void dropTable(table.id);
      }}
    >
      <button type="button" className="workTableSelectButton" onClick={() => setActiveTableId(table.id)}>
        <Table2 size={15} />
        <span>{table.name}</span>
      </button>
      <button
        type="button"
        className="workTableDeleteButton"
        title="テーブルを削除"
        aria-label={`テーブル「${table.name}」を削除`}
        onClick={() => void removeTable(table)}
        onMouseDown={(event) => event.stopPropagation()}
        disabled={saving}
        draggable={false}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
