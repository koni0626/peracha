import { safeHref } from "./richMarkdownInline";
import { appendMarkdownLineToEditorState } from "./richMarkdownLineTransforms";
import { editorHtmlToMarkdown } from "./richMarkdownSerialization";
import {
  createMarkdownTransformState,
  flushEditorLists,
  flushEditorParagraph,
  flushOpenEditorCodeBlock,
} from "./richMarkdownTransformState";

export { editorHtmlToMarkdown, safeHref };

export function markdownToEditorHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const state = createMarkdownTransformState();

  for (let index = 0; index < lines.length; index += 1) {
    index = appendMarkdownLineToEditorState(state, lines, index);
  }

  flushOpenEditorCodeBlock(state);
  flushEditorParagraph(state);
  flushEditorLists(state);
  return state.blocks.join("") || "<p><br></p>";
}
