import { escapeHtml, inlineMarkdownToHtml } from "./richMarkdownInline";

export function renderMarkdownParagraph(lines: string[]) {
  return `<p>${inlineMarkdownToHtml(lines.join("\n"))}</p>`;
}

export function renderMarkdownCodeBlock(lines: string[]) {
  return `<pre><code>${escapeHtml(lines.join("\n"))}</code></pre>`;
}

export function renderMarkdownList(tagName: "ol" | "ul", items: string[]) {
  return `<${tagName}>${items.map((item) => `<li>${inlineMarkdownToHtml(item)}</li>`).join("")}</${tagName}>`;
}
