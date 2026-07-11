import type { MouseEvent } from "react";

import type { WorkTableColumn } from "../types";
import { WorkTableColumnActions } from "./WorkTableColumnActions";
import {
  WORK_TABLE_FIELD_TYPES,
  WorkTableFieldTypeIcon
} from "./WorkTableFieldTypeIcon";
import { workTableColumnDragClass, workTableColumnDragHandlers } from "./workTableColumnDrag";

type WorkTableHeaderCellProps = {
  activeFilterCount: number;
  column: WorkTableColumn;
  draggedColumnId: string | null;
  saving: boolean;
  sortState: { columnId: string; direction: "asc" | "desc" } | null;
  dropColumn: (columnId: string) => void | Promise<void>;
  onDeleteColumn: (column: WorkTableColumn) => void | Promise<void>;
  onEditColumn: (column: WorkTableColumn) => void;
  onOpenFilter: (columnId: string, button: HTMLButtonElement) => void;
  onOpenMenu: (column: WorkTableColumn, event: MouseEvent<HTMLTableCellElement>) => void;
  onToggleSort: (columnId: string) => void;
  setDraggedColumnId: (columnId: string | null) => void;
};

export function WorkTableHeaderCell({
  activeFilterCount,
  column,
  draggedColumnId,
  saving,
  sortState,
  dropColumn,
  onDeleteColumn,
  onEditColumn,
  onOpenFilter,
  onOpenMenu,
  onToggleSort,
  setDraggedColumnId,
}: WorkTableHeaderCellProps) {
  const dragProps = workTableColumnDragHandlers({
    column,
    draggedColumnId,
    dropColumn,
    setDraggedColumnId,
  });

  return (
    <th
      className={workTableColumnDragClass(column.id, draggedColumnId)}
      onContextMenu={(event) => onOpenMenu(column, event)}
      {...dragProps}
    >
      <div className="workTableColumnHeader">
        <span onDoubleClick={() => onEditColumn(column)} title="ダブルクリックで列設定を編集">
          <WorkTableFieldTypeIcon type={column.field_type} />
          {column.name}
        </span>
        <small>{WORK_TABLE_FIELD_TYPES.find((type) => type.value === column.field_type)?.label}</small>
        <WorkTableColumnActions
          activeFilterCount={activeFilterCount}
          column={column}
          saving={saving}
          sortState={sortState}
          onDeleteColumn={onDeleteColumn}
          onOpenFilter={onOpenFilter}
          onToggleSort={onToggleSort}
        />
      </div>
    </th>
  );
}
