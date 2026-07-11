import { currentBlock, emptyBlock, placeCursorIn } from "./richEditorShortcutDom";
import { isTableDivider, markdownTableToHtml, splitTableRow } from "./richMarkdownTables";

export function applyTableMarkdownShortcut(editor: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!range.collapsed || !editor.contains(range.commonAncestorContainer)) {
    return null;
  }

  const dividerBlock = currentBlock(editor, range);
  const dividerLine = dividerBlock.textContent?.trim() ?? "";
  if (!isTableDivider(dividerLine)) {
    return null;
  }

  const headerBlock = dividerBlock.previousElementSibling;
  const headerLine = headerBlock?.textContent?.trim() ?? "";
  if (!headerBlock || !headerLine.includes("|")) {
    return null;
  }

  const template = document.createElement("template");
  template.innerHTML = markdownTableToHtml(splitTableRow(headerLine), []);
  const table = template.content.firstElementChild;
  if (!(table instanceof HTMLTableElement)) {
    return null;
  }

  const paragraph = emptyBlock("p");
  headerBlock.replaceWith(table);
  dividerBlock.replaceWith(paragraph);
  return placeCursorIn(paragraph);
}
