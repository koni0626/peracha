import type { ReactNode } from "react";

import { safeHref, safeMediaSrc } from "./markdownSafety";
import type { InlineMarkdownOptions } from "./markdownInline";

type InlineMarkdownRenderer = (text: string, keyPrefix: string, options?: InlineMarkdownOptions) => ReactNode[];

export function renderInlineMarkdownToken(
  token: string,
  key: string,
  renderInlineMarkdown: InlineMarkdownRenderer,
  options: InlineMarkdownOptions = {}
) {
  if (token.startsWith("![")) {
    const imageMatch = token.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (!imageMatch) {
      return token;
    }
    return (
      <img
        alt={imageMatch[1]}
        className="markdownInlineImage"
        key={key}
        loading="lazy"
        src={safeMediaSrc(imageMatch[2])}
        title={imageMatch[1]}
      />
    );
  }

  if ((token.startsWith("**") && token.endsWith("**")) || (token.startsWith("__") && token.endsWith("__"))) {
    return <strong key={key}>{renderInlineMarkdown(token.slice(2, -2), `${key}-strong`)}</strong>;
  }

  if ((token.startsWith("*") && token.endsWith("*")) || (token.startsWith("_") && token.endsWith("_"))) {
    return <em key={key}>{renderInlineMarkdown(token.slice(1, -1), `${key}-em`)}</em>;
  }

  if (token.startsWith("`") && token.endsWith("`")) {
    return <code key={key}>{token.slice(1, -1)}</code>;
  }

  const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (!linkMatch) {
    return token;
  }

  return (
    <a href={safeHref(linkMatch[2])} key={key} rel="noreferrer" target="_blank">
      {renderInlineMarkdown(linkMatch[1], `${key}-link`, { ...options, autoLinkUrls: false })}
    </a>
  );
}
