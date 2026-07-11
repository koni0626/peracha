import type { WorkTableColumn, WorkTableRecord } from "../types";
import type { ColumnContextMenuState, RecordContextMenuState } from "./workTablePanelTypes";

type WorkTableColumnContextMenuProps = {
  column: WorkTableColumn;
  menu: ColumnContextMenuState;
  onAddLeft: (column: WorkTableColumn) => void;
  onAddRight: (column: WorkTableColumn) => void;
};

type WorkTableRecordContextMenuProps = {
  menu: RecordContextMenuState;
  record: WorkTableRecord | null;
  onAddFirst: () => void | Promise<void>;
  onAddAbove: (record: WorkTableRecord) => void | Promise<void>;
  onAddBelow: (record: WorkTableRecord) => void | Promise<void>;
};

export function WorkTableColumnContextMenu({ column, menu, onAddLeft, onAddRight }: WorkTableColumnContextMenuProps) {
  return (
    <div
      className="workTableContextMenu"
      style={{ left: menu.x, top: menu.y }}
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" onClick={() => onAddLeft(column)}>
        左に列を追加
      </button>
      <button type="button" onClick={() => onAddRight(column)}>
        右に列を追加
      </button>
    </div>
  );
}

export function WorkTableRecordContextMenu({
  menu,
  record,
  onAddFirst,
  onAddAbove,
  onAddBelow,
}: WorkTableRecordContextMenuProps) {
  return (
    <div
      className="workTableContextMenu"
      style={{ left: menu.x, top: menu.y }}
      onClick={(event) => event.stopPropagation()}
    >
      {record ? (
        <>
          <button type="button" onClick={() => void onAddAbove(record)}>
            上に行を追加
          </button>
          <button type="button" onClick={() => void onAddBelow(record)}>
            下に行を追加
          </button>
        </>
      ) : (
        <button type="button" onClick={() => void onAddFirst()}>
          行を追加
        </button>
      )}
    </div>
  );
}
