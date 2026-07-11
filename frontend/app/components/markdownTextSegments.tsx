import type { ReactNode } from "react";

import { safeHref, trimUrlPunctuation } from "./markdownSafety";

function renderMentions(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const mentionPattern = /(^|[\s\u3000])(@[^\s@]+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mentionPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...renderMentions(text.slice(lastIndex, match.index), `${keyPrefix}-mentions-${lastIndex}`));
    }
    if (match[1]) {
      nodes.push(match[1]);
    }
    const { hrefText, trailing } = trimUrlPunctuation(match[2]);
    nodes.push(
      <span className="mentionText" key={`${keyPrefix}-mention-${match.index}`}>
        {hrefText}
      </span>
    );
    if (trailing) {
      nodes.push(trailing);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

type RenderPlainMarkdownTextOptions = {
  autoLinkUrls?: boolean;
};

export function renderPlainMarkdownText(
  text: string,
  keyPrefix: string,
  { autoLinkUrls = true }: RenderPlainMarkdownTextOptions = {}
): ReactNode[] {
  if (!autoLinkUrls) {
    return renderMentions(text, `${keyPrefix}-mentions`);
  }

  const nodes: ReactNode[] = [];
  const urlPattern = /(https?:\/\/[^\s<>()]+|www\.[^\s<>()]+)/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = urlPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const { hrefText, trailing } = trimUrlPunctuation(match[0]);
    nodes.push(
      <a href={safeHref(hrefText)} key={`${keyPrefix}-url-${match.index}`} rel="noreferrer" target="_blank">
        {hrefText}
      </a>
    );
    if (trailing) {
      nodes.push(trailing);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(...renderMentions(text.slice(lastIndex), `${keyPrefix}-mentions-${lastIndex}`));
  }
  return nodes;
}
