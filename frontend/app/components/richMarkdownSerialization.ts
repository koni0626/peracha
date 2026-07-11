import { inlineNodeToMarkdown } from "./richMarkdownInline";
import { tableToMarkdown } from "./richMarkdownTables";

export function editorHtmlToMarkdown(root: HTMLElement) {
  const cleanRoot = root.cloneNode(true) as HTMLElement;
  cleanRoot.querySelectorAll(".editorStampRemoveButton").forEach((node) => node.remove());
  cleanRoot.querySelectorAll(".editorUploadPlaceholder").forEach((node) => node.remove());

  return Array.from(cleanRoot.childNodes)
    .map(blockNodeToMarkdown)
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function blockNodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").trim();
  }
  if (!(node instanceof HTMLElement)) {
    return "";
  }
  const content = Array.from(node.childNodes).map(inlineNodeToMarkdown).join("").trim();
  switch (node.tagName) {
    case "H1":
      return content ? `# ${content}` : "";
    case "H2":
      return content ? `## ${content}` : "";
    case "H3":
      return content ? `### ${content}` : "";
    case "BLOCKQUOTE":
      return content ? content.split("\n").map((line) => `> ${line}`).join("\n") : "";
    case "UL":
      return Array.from(node.children).map((item) => `- ${inlineNodeToMarkdown(item).trim()}`).join("\n");
    case "OL":
      return Array.from(node.children).map((item, index) => `${index + 1}. ${inlineNodeToMarkdown(item).trim()}`).join("\n");
    case "PRE":
      return `\`\`\`\n${node.textContent ?? ""}\n\`\`\``;
    case "TABLE":
      return tableToMarkdown(node as HTMLTableElement);
    case "DIV":
    case "P":
      return content;
    default:
      return content;
  }
}
