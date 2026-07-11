import { parseDocx, parsePptx, parseWorkbook } from "./officePreviewParsers";
import type { PptSlidePreview, WorkbookPreview } from "./officePreviewParsers";

export type OfficePreviewKind = "docx" | "xlsx" | "pptx";

export type LoadedOfficePreview =
  | { kind: "docx"; html: string }
  | { kind: "xlsx"; workbook: WorkbookPreview }
  | { kind: "pptx"; slides: PptSlidePreview[] };

export async function fetchOfficePreviewBuffer(url: string) {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Preview request failed: ${response.status}`);
  }
  return response.arrayBuffer();
}

export async function loadOfficePreview(kind: OfficePreviewKind, url: string): Promise<LoadedOfficePreview> {
  const buffer = await fetchOfficePreviewBuffer(url);
  if (kind === "xlsx") {
    return { kind, workbook: await parseWorkbook(buffer) };
  }
  if (kind === "docx") {
    return { kind, html: await parseDocx(buffer) };
  }
  return { kind, slides: await parsePptx(buffer) };
}
