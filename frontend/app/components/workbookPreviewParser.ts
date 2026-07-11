import JSZip from "jszip";

import type { WorkbookPreview } from "./officePreviewTypes";
import { decodeCellReference, valueFromCell } from "./workbookCellValue";
import { localName, xmlDocument } from "./officeXmlUtils";
import { readSharedStrings, workbookSheets } from "./workbookMetadata";

export async function parseWorkbook(buffer: ArrayBuffer): Promise<WorkbookPreview> {
  const zip = await JSZip.loadAsync(buffer);
  const sharedStrings = await readSharedStrings(zip);
  const sheetMetadata = (await workbookSheets(zip)).slice(0, 12);
  const sheets: Record<string, string[][]> = {};

  for (const sheet of sheetMetadata) {
    const sheetXml = await zip.file(sheet.path)?.async("text");
    if (!sheetXml) {
      sheets[sheet.name] = [];
      continue;
    }
    const rows: string[][] = Array.from({ length: 120 }, () => []);
    let maxRow = 0;
    let maxColumn = 0;
    for (const cell of Array.from(xmlDocument(sheetXml).getElementsByTagName("*")).filter((node) => localName(node) === "c")) {
      const reference = decodeCellReference(cell.getAttribute("r") ?? "");
      if (!reference || reference.row >= 120 || reference.column >= 40) {
        continue;
      }
      rows[reference.row][reference.column] = valueFromCell(cell, sharedStrings);
      maxRow = Math.max(maxRow, reference.row + 1);
      maxColumn = Math.max(maxColumn, reference.column + 1);
    }
    sheets[sheet.name] = rows.slice(0, maxRow).map((row) =>
      Array.from({ length: maxColumn }, (_, index) => row[index] ?? "")
    );
  }

  return { sheetNames: sheetMetadata.map((sheet) => sheet.name), sheets };
}
