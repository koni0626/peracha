import type { ReactNode } from "react";

import { renderInlineMarkdownToken } from "./markdownInlineToken";
import { renderPlainMarkdownText } from "./markdownTextSegments";

export type InlineMarkdownOptions = {
  autoLinkUrls?: boolean;
};

export function renderInlineMarkdown(
  text: string,
  keyPrefix: string,
  options: InlineMarkdownOptions = {}
): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(!\[[^\]]*\]\([^)\s]+\)|\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|_[^_]+_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...renderPlainMarkdownText(text.slice(lastIndex, match.index), `${keyPrefix}-plain-${lastIndex}`, options));
    }
    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;
    nodes.push(renderInlineMarkdownToken(token, key, renderInlineMarkdown, options));
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(...renderPlainMarkdownText(text.slice(lastIndex), `${keyPrefix}-plain-${lastIndex}`, options));
  }
  return nodes;
}
