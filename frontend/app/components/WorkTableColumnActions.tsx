import { ArrowDownAZ, ArrowUpDown, Filter, Trash2 } from "lucide-react";

import type { WorkTableColumn } from "../types";

type WorkTableColumnActionsProps = {
  activeFilterCount: number;
  column: WorkTableColumn;
  saving: boolean;
  sortState: { columnId: string; direction: "asc" | "desc" } | null;
  onDeleteColumn: (column: WorkTableColumn) => void | Promise<void>;
  onOpenFilter: (columnId: string, button: HTMLButtonElement) => void;
  onToggleSort: (columnId: string) => void;
};

export function WorkTableColumnActions({
  activeFilterCount,
  column,
  saving,
  sortState,
  onDeleteColumn,
  onOpenFilter,
  onToggleSort,
}: WorkTableColumnActionsProps) {
  const sorted = sortState?.columnId === column.id;

  return (
    <div className="workTableColumnActions">
      <button type="button" title="ソート" className={sorted ? "active" : ""} onClick={() => onToggleSort(column.id)}>
        {sorted ? <ArrowDownAZ size={13} /> : <ArrowUpDown size={13} />}
      </button>
      <div className="workTableFilter">
        <button
          type="button"
          title="絞り込み"
          className={activeFilterCount > 0 ? "active" : ""}
          onClick={(event) => onOpenFilter(column.id, event.currentTarget)}
        >
          <Filter size={13} />
          {activeFilterCount > 0 ? <b>{activeFilterCount}</b> : null}
        </button>
      </div>
      <button
        type="button"
        title="列を削除"
        className="dangerColumnAction"
        onClick={() => void onDeleteColumn(column)}
        disabled={saving}
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
