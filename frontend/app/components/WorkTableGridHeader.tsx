import type { MouseEvent } from "react";

import type { WorkTableColumn } from "../types";
import { WorkTableHeaderCell } from "./WorkTableHeaderCell";
import type { WorkTableSortState } from "./workTablePanelTypes";

export type WorkTableGridHeaderProps = {
  columns: WorkTableColumn[];
  draggedColumnId: string | null;
  saving: boolean;
  sortState: WorkTableSortState;
  activeFilterCount: (columnId: string) => number;
  dropColumn: (columnId: string) => void | Promise<void>;
  openColumnContextMenu: (event: MouseEvent, column: WorkTableColumn) => void;
  openColumnEditor: (column: WorkTableColumn) => void;
  removeColumn: (column: WorkTableColumn) => void | Promise<void>;
  setDraggedColumnId: (columnId: string | null) => void;
  toggleFilterMenu: (columnId: string, button: HTMLButtonElement) => void;
  toggleSort: (columnId: string) => void;
};

export function WorkTableGridHeader({
  columns,
  draggedColumnId,
  saving,
  sortState,
  activeFilterCount,
  dropColumn,
  openColumnContextMenu,
  openColumnEditor,
  removeColumn,
  setDraggedColumnId,
  toggleFilterMenu,
  toggleSort,
}: WorkTableGridHeaderProps) {
  return (
    <thead>
      <tr>
        <th className="rowNumberCell">#</th>
        {columns.map((column) => (
          <WorkTableHeaderCell
            activeFilterCount={activeFilterCount(column.id)}
            column={column}
            draggedColumnId={draggedColumnId}
            dropColumn={dropColumn}
            key={column.id}
            saving={saving}
            sortState={sortState}
            onDeleteColumn={removeColumn}
            onEditColumn={openColumnEditor}
            onOpenFilter={toggleFilterMenu}
            onOpenMenu={(targetColumn, event) => openColumnContextMenu(event, targetColumn)}
            onToggleSort={toggleSort}
            setDraggedColumnId={setDraggedColumnId}
          />
        ))}
      </tr>
    </thead>
  );
}
