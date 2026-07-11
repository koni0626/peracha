export type SelectCell = (cell: HTMLTableCellElement | undefined) => void;

export function createTableCell(tagName: string) {
  const cell = document.createElement(tagName);
  cell.appendChild(document.createElement("br"));
  return cell;
}
