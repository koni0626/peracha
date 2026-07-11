import type { TableEditAction } from "./RichMarkdownToolbar";
import { createTableCell, type SelectCell } from "./richEditorTableCells";

export function editRichEditorTableRow(
  action: TableEditAction,
  row: HTMLTableRowElement,
  cell: HTMLTableCellElement,
  selectCell: SelectCell
) {
  const columnIndex = cell.cellIndex;
  if (action === "row-delete") {
    const rowGroup = row.parentElement;
    const siblingRows = rowGroup
      ? Array.from(rowGroup.children).filter((child): child is HTMLTableRowElement => child instanceof HTMLTableRowElement)
      : [];
    if (siblingRows.length <= 1) {
      return false;
    }
    const rowIndex = siblingRows.indexOf(row);
    const targetRow = siblingRows[rowIndex + 1] ?? siblingRows[rowIndex - 1];
    row.remove();
    selectCell(targetRow?.cells[Math.min(columnIndex, Math.max(targetRow.cells.length - 1, 0))]);
    return true;
  }

  if (action !== "row-above" && action !== "row-below") {
    return false;
  }
  const newRow = row.cloneNode(false) as HTMLTableRowElement;
  Array.from(row.cells).forEach((sourceCell) => {
    newRow.appendChild(createTableCell(sourceCell.tagName.toLowerCase()));
  });
  if (action === "row-above") {
    row.parentElement?.insertBefore(newRow, row);
  } else {
    row.parentElement?.insertBefore(newRow, row.nextSibling);
  }
  selectCell(newRow.cells[columnIndex]);
  return true;
}
