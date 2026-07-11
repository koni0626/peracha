import {
  collectMarkdownTable,
  collectQuoteLines,
  pushHeadingBlock,
  pushMarkdownTableBlock,
  pushQuoteBlock,
} from "./markdownBlockHelpers";
import {
  createMarkdownBlockState,
  flushList,
  flushOpenCodeBlock,
  flushParagraph,
  toggleCodeBlock,
} from "./markdownBlockState";
import { isMarkdownTableCandidate } from "./markdownTable";

export function renderMarkdownBlocks(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const state = createMarkdownBlockState();

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const key = `md-${index}`;
    if (line.trim().startsWith("```")) {
      toggleCodeBlock(state, key);
      continue;
    }
    if (state.inCodeBlock) {
      state.codeLines.push(line);
      continue;
    }
    if (!line.trim()) {
      flushParagraph(state, `${key}-p`);
      flushList(state, `${key}-list`);
      continue;
    }

    if (isMarkdownTableCandidate(line, lines[index + 1])) {
      flushParagraph(state, `${key}-p`);
      flushList(state, `${key}-list`);
      const table = collectMarkdownTable(lines, index);
      index = table.nextIndex;
      pushMarkdownTableBlock(state.blocks, line, table.dividerLine, table.bodyLines, key);
      continue;
    }

    if (/^(#{1,3})\s+/.test(line)) {
      flushParagraph(state, `${key}-p`);
      flushList(state, `${key}-list`);
      pushHeadingBlock(state.blocks, line, key);
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph(state, `${key}-p`);
      flushList(state, `${key}-list`);
      const collectedQuote = collectQuoteLines(lines, index, quote[1]);
      index = collectedQuote.nextIndex;
      pushQuoteBlock(state.blocks, collectedQuote.quoteLines, key);
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph(state, `${key}-p`);
      state.listItems.push({ text: (unordered ?? ordered)?.[1] ?? "", ordered: Boolean(ordered) });
      continue;
    }

    flushList(state, `${key}-list`);
    state.paragraph.push(line);
  }

  flushOpenCodeBlock(state, "md-open-code");
  flushParagraph(state, "md-last-p");
  flushList(state, "md-last-list");

  return state.blocks;
}
