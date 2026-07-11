import { firstChildText, localName } from "./officeXmlUtils";

export type CellReference = {
  column: number;
  row: number;
};

export function decodeCellReference(reference: string): CellReference | null {
  const match = reference.match(/^([A-Z]+)(\d+)$/i);
  if (!match) {
    return null;
  }

  const [, letters, rowText] = match;
  let column = 0;
  for (const letter of letters.toUpperCase()) {
    column = column * 26 + letter.charCodeAt(0) - 64;
  }

  return { row: Number(rowText) - 1, column: column - 1 };
}

function readInlineString(cell: Element) {
  return Array.from(cell.getElementsByTagName("*"))
    .filter((node) => localName(node) === "t")
    .map((node) => node.textContent ?? "")
    .join("");
}

export function valueFromCell(cell: Element, sharedStrings: string[]) {
  const type = cell.getAttribute("t");
  if (type === "inlineStr") {
    return readInlineString(cell);
  }

  const rawValue = firstChildText(cell, "v");
  if (!rawValue) {
    return "";
  }

  if (type === "s") {
    return sharedStrings[Number(rawValue)] ?? rawValue;
  }

  if (type === "b") {
    return rawValue === "1" ? "TRUE" : "FALSE";
  }

  return rawValue;
}
