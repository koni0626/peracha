import { inlineMarkdownToHtml } from "./richMarkdownInline";
import { isTableDivider, markdownTableBlockToHtml } from "./richMarkdownTables";
import {
  flushEditorLists,
  flushEditorParagraph,
  toggleEditorCodeBlock,
  type MarkdownTransformState,
} from "./richMarkdownTransformState";

export function appendMarkdownLineToEditorState(
  state: MarkdownTransformState,
  lines: string[],
  index: number,
) {
  const line = lines[index];
  if (line.trim().startsWith("```")) {
    toggleEditorCodeBlock(state);
    return index;
  }
  if (state.inCodeBlock) {
    state.codeLines.push(line);
    return index;
  }
  if (!line.trim()) {
    flushEditorParagraph(state);
    flushEditorLists(state);
    return index;
  }
  if (line.includes("|") && isTableDivider(lines[index + 1])) {
    flushEditorParagraph(state);
    flushEditorLists(state);
    const table = markdownTableBlockToHtml(lines, index);
    state.blocks.push(table.html);
    return table.nextIndex;
  }

  const heading = line.match(/^(#{1,3})\s+(.+)$/);
  if (heading) {
    flushEditorParagraph(state);
    flushEditorLists(state);
    state.blocks.push(`<h${heading[1].length}>${inlineMarkdownToHtml(heading[2])}</h${heading[1].length}>`);
    return index;
  }

  const quote = line.match(/^>\s?(.+)$/);
  if (quote) {
    flushEditorParagraph(state);
    flushEditorLists(state);
    state.blocks.push(`<blockquote>${inlineMarkdownToHtml(quote[1])}</blockquote>`);
    return index;
  }

  const unordered = line.match(/^[-*]\s+(.+)$/);
  const ordered = line.match(/^\d+\.\s+(.+)$/);
  if (unordered) {
    flushEditorParagraph(state);
    state.orderedListItems = [];
    state.listItems.push(unordered[1]);
    return index;
  }
  if (ordered) {
    flushEditorParagraph(state);
    state.listItems = [];
    state.orderedListItems.push(ordered[1]);
    return index;
  }
  flushEditorLists(state);
  state.paragraph.push(line);
  return index;
}
