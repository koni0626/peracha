import JSZip from "jszip";

import type { PptSlidePreview } from "./officePreviewTypes";
import { textFromDrawingXml } from "./officeXmlUtils";

export async function parsePptx(buffer: ArrayBuffer): Promise<PptSlidePreview[]> {
  const zip = await JSZip.loadAsync(buffer);
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((left, right) => Number(left.match(/\d+/)?.[0] ?? 0) - Number(right.match(/\d+/)?.[0] ?? 0));
  const slides: PptSlidePreview[] = [];

  for (const [index, name] of slideNames.entries()) {
    const xml = await zip.files[name].async("text");
    const lines = textFromDrawingXml(xml);
    slides.push({
      title: lines[0] || `Slide ${index + 1}`,
      lines: lines.slice(lines[0] ? 1 : 0)
    });
  }

  return slides;
}
