import type { TableEditAction } from "./RichMarkdownToolbar";
import { createTableCell, type SelectCell } from "./richEditorTableCells";

export function editRichEditorTableColumn(
  action: TableEditAction,
  table: HTMLTableElement,
  row: HTMLTableRowElement,
  cell: HTMLTableCellElement,
  selectCell: SelectCell
) {
  const columnIndex = cell.cellIndex;
  if (action === "column-delete") {
    const columnCount = Math.max(...Array.from(table.rows).map((tableRow) => tableRow.cells.length));
    if (columnCount <= 1) {
      return false;
    }
    Array.from(table.rows).forEach((tableRow) => {
      tableRow.cells[columnIndex]?.remove();
    });
    const targetIndex = Math.min(columnIndex, Math.max(row.cells.length - 1, 0));
    selectCell(row.cells[targetIndex]);
    return true;
  }

  if (action !== "column-left" && action !== "column-right") {
    return false;
  }
  const insertIndex = action === "column-left" ? columnIndex : columnIndex + 1;
  Array.from(table.rows).forEach((tableRow) => {
    const reference = tableRow.cells[insertIndex] ?? null;
    const tagName = tableRow.parentElement?.tagName === "THEAD" ? "th" : "td";
    tableRow.insertBefore(createTableCell(tagName), reference);
  });
  selectCell(row.cells[insertIndex]);
  return true;
}
