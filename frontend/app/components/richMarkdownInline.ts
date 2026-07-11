export { safeHref, safeMediaSrc } from "./markdownSafety";
export { inlineNodeToMarkdown } from "./richMarkdownNodeSerialization";

import { safeHref, safeMediaSrc, trimUrlPunctuation } from "./markdownSafety";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function inlineMarkdownToHtml(text: string) {
  const tokenPattern = /(`[^`]+`|!\[[^\]]*\]\([^)\s]+\)|\[[^\]]+\]\([^)]+\))/g;
  let html = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      html += inlinePlainTextToHtml(text.slice(lastIndex, match.index));
    }
    html += inlineMarkdownTokenToHtml(match[0]);
    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    html += inlinePlainTextToHtml(text.slice(lastIndex));
  }
  return html;
}

function inlineMarkdownTokenToHtml(token: string) {
  if (token.startsWith("`") && token.endsWith("`")) {
    return `<code>${escapeHtml(token.slice(1, -1))}</code>`;
  }
  const image = token.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
  if (image) {
    const safeSrc = escapeHtml(safeMediaSrc(image[2]));
    const safeLabel = escapeHtml(image[1]);
    return `<img class="markdownInlineImage" src="${safeSrc}" alt="${safeLabel}" title="${safeLabel}" data-markdown-src="${safeSrc}">`;
  }
  const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (link) {
    return `<a href="${escapeHtml(safeHref(link[2]))}" target="_blank" rel="noreferrer">${inlinePlainTextToHtml(link[1], false)}</a>`;
  }
  return inlinePlainTextToHtml(token);
}

function inlinePlainTextToHtml(text: string, autoLinkUrls = true) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");
  return autoLinkUrls ? autoLinkEscapedText(html) : html;
}

function autoLinkEscapedText(html: string) {
  return html.replace(/(https?:\/\/[^\s<>()]+|www\.[^\s<>()]+)/gi, (url: string) => {
    const { hrefText, trailing } = trimUrlPunctuation(url);
    return `<a href="${escapeHtml(safeHref(hrefText))}" target="_blank" rel="noreferrer">${hrefText}</a>${trailing}`;
  });
}
