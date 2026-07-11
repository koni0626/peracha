export async function parseDocx(buffer: ArrayBuffer) {
  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
  return result.value;
}
