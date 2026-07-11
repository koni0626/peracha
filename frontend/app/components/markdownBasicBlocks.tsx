import type { ReactNode } from "react";

import { renderInlineMarkdown } from "./markdownInline";

export function pushCodeBlock(blocks: ReactNode[], codeLines: string[], key: string) {
  blocks.push(
    <pre key={key}>
      <code>{codeLines.join("\n")}</code>
    </pre>
  );
}

export function pushHeadingBlock(blocks: ReactNode[], line: string, key: string) {
  const heading = line.match(/^(#{1,3})\s+(.+)$/);
  if (!heading) {
    return false;
  }
  const level = heading[1].length;
  const content = renderInlineMarkdown(heading[2], key);
  if (level === 1) {
    blocks.push(<h1 key={key}>{content}</h1>);
  } else if (level === 2) {
    blocks.push(<h2 key={key}>{content}</h2>);
  } else {
    blocks.push(<h3 key={key}>{content}</h3>);
  }
  return true;
}
