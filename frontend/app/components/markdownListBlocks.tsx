import type { ReactNode } from "react";

import { renderInlineMarkdown } from "./markdownInline";

export type ListItem = {
  text: string;
  ordered: boolean;
};

export function flushMarkdownList(blocks: ReactNode[], listItems: ListItem[], key: string) {
  if (listItems.length === 0) {
    return;
  }
  const ordered = listItems[0].ordered;
  const children = listItems.map((item, index) => (
    <li key={`${key}-${index}`}>{renderInlineMarkdown(item.text, `${key}-${index}`)}</li>
  ));
  blocks.push(ordered ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>);
  listItems.length = 0;
}
