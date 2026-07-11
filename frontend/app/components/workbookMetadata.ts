import type JSZip from "jszip";

import { localName, xmlDocument } from "./officeXmlUtils";

export type WorkbookSheetMetadata = {
  name: string;
  path: string;
};

export async function readSharedStrings(zip: JSZip) {
  const file = zip.file("xl/sharedStrings.xml");
  if (!file) {
    return [];
  }

  const xml = await file.async("text");
  const documentXml = xmlDocument(xml);
  return Array.from(documentXml.getElementsByTagName("*"))
    .filter((node) => localName(node) === "si")
    .map((node) =>
      Array.from(node.getElementsByTagName("*"))
        .filter((child) => localName(child) === "t")
        .map((child) => child.textContent ?? "")
        .join("")
    );
}

export async function workbookSheets(zip: JSZip): Promise<WorkbookSheetMetadata[]> {
  const workbookXml = await zip.file("xl/workbook.xml")?.async("text");
  const relsXml = await zip.file("xl/_rels/workbook.xml.rels")?.async("text");
  if (!workbookXml || !relsXml) {
    return [];
  }

  const relationshipTargets = new Map<string, string>();
  for (const relationship of Array.from(xmlDocument(relsXml).getElementsByTagName("*")).filter(
    (node) => localName(node) === "Relationship"
  )) {
    const id = relationship.getAttribute("Id");
    const target = relationship.getAttribute("Target");
    if (id && target) {
      relationshipTargets.set(id, target.startsWith("/") ? target.slice(1) : `xl/${target}`);
    }
  }

  return Array.from(xmlDocument(workbookXml).getElementsByTagName("*"))
    .filter((node) => localName(node) === "sheet")
    .map((sheet, index) => {
      const id = sheet.getAttribute("r:id") ?? sheet.getAttribute("id") ?? "";
      return {
        name: sheet.getAttribute("name") || `Sheet ${index + 1}`,
        path: relationshipTargets.get(id) ?? `xl/worksheets/sheet${index + 1}.xml`,
      };
    });
}
