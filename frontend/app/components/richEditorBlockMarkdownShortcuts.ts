import {
  currentBlock,
  emptyBlock,
  isEmptyAfterMarker,
  replaceBlock,
  replaceBlockWithCursorTarget,
  textBeforeCaretInBlock,
} from "./richEditorShortcutDom";

export function applyBlockMarkdownShortcut(editor: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!range.collapsed || !editor.contains(range.commonAncestorContainer)) {
    return null;
  }

  const block = currentBlock(editor, range);
  const marker = textBeforeCaretInBlock(block, range).trim();
  if (!isEmptyAfterMarker(block, range)) {
    return null;
  }

  if (/^#{1,3}$/.test(marker)) {
    return replaceBlock(editor, block, emptyBlock(`h${marker.length}`));
  }
  if (marker === ">") {
    return replaceBlock(editor, block, emptyBlock("blockquote"));
  }
  if (marker === "-" || marker === "*") {
    const list = document.createElement("ul");
    const item = emptyBlock("li");
    list.appendChild(item);
    return replaceBlockWithCursorTarget(editor, block, list, item);
  }
  if (marker === "1.") {
    const list = document.createElement("ol");
    const item = emptyBlock("li");
    list.appendChild(item);
    return replaceBlockWithCursorTarget(editor, block, list, item);
  }
  if (marker === "```") {
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.appendChild(document.createElement("br"));
    pre.appendChild(code);
    return replaceBlockWithCursorTarget(editor, block, pre, code);
  }
  return null;
}
