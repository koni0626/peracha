import type { ReactNode } from "react";

import { renderInlineMarkdown } from "./markdownInline";
import { flushMarkdownList, pushCodeBlock } from "./markdownBlockHelpers";
import type { ListItem } from "./markdownBlockHelpers";

export type MarkdownBlockState = {
  blocks: ReactNode[];
  codeLines: string[];
  inCodeBlock: boolean;
  listItems: ListItem[];
  paragraph: string[];
};

export function createMarkdownBlockState(): MarkdownBlockState {
  return {
    blocks: [],
    codeLines: [],
    inCodeBlock: false,
    listItems: [],
    paragraph: [],
  };
}

export function flushParagraph(state: MarkdownBlockState, key: string) {
  if (state.paragraph.length === 0) {
    return;
  }
  state.blocks.push(<p key={key}>{renderInlineMarkdown(state.paragraph.join("\n"), key)}</p>);
  state.paragraph = [];
}

export function flushList(state: MarkdownBlockState, key: string) {
  flushMarkdownList(state.blocks, state.listItems, key);
}

export function flushOpenCodeBlock(state: MarkdownBlockState, key: string) {
  if (!state.inCodeBlock) {
    return;
  }
  pushCodeBlock(state.blocks, state.codeLines, key);
}

export function toggleCodeBlock(state: MarkdownBlockState, key: string) {
  flushParagraph(state, `${key}-p`);
  flushList(state, `${key}-list`);
  if (state.inCodeBlock) {
    pushCodeBlock(state.blocks, state.codeLines, `${key}-code`);
    state.codeLines = [];
  }
  state.inCodeBlock = !state.inCodeBlock;
}
