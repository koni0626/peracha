import { Plus } from "lucide-react";

import type { WorkTable } from "../types";
import { WorkTableCreateInline } from "./WorkTableCreateInline";
import { WorkTableListItem } from "./WorkTableListItem";

export type WorkTableSidebarProps = {
  activeTable: WorkTable;
  creatingTable: boolean;
  draggedTableId: string | null;
  roomId: string | null;
  saving: boolean;
  tableName: string;
  tables: WorkTable[];
  addTable: () => void | Promise<void>;
  dropTable: (tableId: string) => void | Promise<void>;
  removeTable: (table: WorkTable) => void | Promise<void>;
  setActiveTableId: (tableId: string) => void;
  setCreatingTable: (creating: boolean) => void;
  setDraggedTableId: (tableId: string | null) => void;
  setTableName: (name: string) => void;
};

export function WorkTableSidebar({
  activeTable,
  creatingTable,
  draggedTableId,
  roomId,
  saving,
  tableName,
  tables,
  addTable,
  dropTable,
  removeTable,
  setActiveTableId,
  setCreatingTable,
  setDraggedTableId,
  setTableName,
}: WorkTableSidebarProps) {
  return (
    <aside className="workTableList">
      {tables.map((table) => (
        <WorkTableListItem
          active={table.id === activeTable.id}
          draggedTableId={draggedTableId}
          key={table.id}
          saving={saving}
          table={table}
          dropTable={dropTable}
          removeTable={removeTable}
          setActiveTableId={setActiveTableId}
          setDraggedTableId={setDraggedTableId}
        />
      ))}
      {creatingTable ? (
        <WorkTableCreateInline
          saving={saving}
          tableName={tableName}
          addTable={addTable}
          setCreatingTable={setCreatingTable}
          setTableName={setTableName}
        />
      ) : (
        <button type="button" className="workTableAddButton" onClick={() => setCreatingTable(true)} disabled={!roomId || saving}>
          <Plus size={16} />
        </button>
      )}
    </aside>
  );
}
