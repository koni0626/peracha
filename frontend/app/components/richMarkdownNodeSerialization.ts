export function inlineNodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }
  if (!(node instanceof HTMLElement)) {
    return "";
  }
  const content = Array.from(node.childNodes).map(inlineNodeToMarkdown).join("");
  switch (node.tagName) {
    case "IMG": {
      if (node.dataset.uploading === "true") {
        return "";
      }
      const src = node.dataset.markdownSrc || node.getAttribute("src") || "";
      const alt = node.getAttribute("alt") || node.getAttribute("title") || "画像";
      return src ? `![${escapeMarkdownImageLabel(alt)}](${src})` : "";
    }
    case "B":
    case "STRONG":
      return content ? `**${content}**` : "";
    case "I":
    case "EM":
      return content ? `_${content}_` : "";
    case "CODE":
      return node.closest("pre") ? node.textContent ?? "" : `\`${node.textContent ?? ""}\``;
    case "A":
      return content ? `[${content}](${node.getAttribute("href") ?? "#"})` : "";
    case "BR":
      return "\n";
    default:
      return content;
  }
}

function escapeMarkdownImageLabel(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\]/g, "\\]");
}
