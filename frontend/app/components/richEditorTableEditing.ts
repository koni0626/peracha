import type { TableEditAction } from "./RichMarkdownToolbar";
import { editRichEditorTableColumn } from "./richEditorTableColumnActions";
import { type SelectCell } from "./richEditorTableCells";
import { editRichEditorTableRow } from "./richEditorTableRowActions";

export function editRichEditorTable(action: TableEditAction, cell: HTMLTableCellElement | null, selectCell: SelectCell) {
  if (!cell) {
    return false;
  }
  const row = cell.parentElement as HTMLTableRowElement | null;
  const table = cell.closest("table");
  if (!row || !table) {
    return false;
  }

  return (
    editRichEditorTableRow(action, row, cell, selectCell) ||
    editRichEditorTableColumn(action, table, row, cell, selectCell)
  );
}
