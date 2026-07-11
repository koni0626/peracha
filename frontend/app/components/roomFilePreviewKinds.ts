export function isOfficePreviewKind(kind: string): kind is "docx" | "xlsx" | "pptx" {
  return kind === "docx" || kind === "xlsx" || kind === "pptx";
}
