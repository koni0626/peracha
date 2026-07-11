import type { ReactNode } from "react";

import { renderInlineMarkdown } from "./markdownInline";

export function collectQuoteLines(lines: string[], startIndex: number, firstLine: string) {
  const quoteLines = [firstLine];
  let index = startIndex;
  while (index + 1 < lines.length) {
    const nextQuote = lines[index + 1].match(/^>\s?(.*)$/);
    if (!nextQuote) {
      break;
    }
    quoteLines.push(nextQuote[1]);
    index += 1;
  }
  return {
    nextIndex: index,
    quoteLines,
  };
}

export function pushQuoteBlock(blocks: ReactNode[], quoteLines: string[], key: string) {
  blocks.push(<blockquote key={key}>{renderInlineMarkdown(quoteLines.join("\n"), key)}</blockquote>);
}
