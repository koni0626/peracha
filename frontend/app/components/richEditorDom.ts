export function selectedElementFromRange(range: Range | null) {
  if (!range) {
    return null;
  }
  const node = range.commonAncestorContainer;
  return node instanceof HTMLElement ? node : node.parentElement;
}

export function selectionElementInEditor(editor: HTMLElement | null) {
  const selection = window.getSelection();
  if (!editor || !selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) {
    return null;
  }
  return range.commonAncestorContainer instanceof HTMLElement
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement;
}

export function rangeFromTextOffsets(editor: HTMLElement, start: number, end: number) {
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let position = 0;
  let startSet = false;
  let node = walker.nextNode();

  while (node) {
    const textLength = node.textContent?.length ?? 0;
    const nextPosition = position + textLength;
    if (!startSet && start <= nextPosition) {
      range.setStart(node, Math.max(0, start - position));
      startSet = true;
    }
    if (startSet && end <= nextPosition) {
      range.setEnd(node, Math.max(0, end - position));
      return range;
    }
    position = nextPosition;
    node = walker.nextNode();
  }

  range.selectNodeContents(editor);
  range.collapse(false);
  return range;
}

export function moveCaretIntoCell(cell: HTMLTableCellElement | undefined) {
  if (!cell) {
    return null;
  }
  const range = document.createRange();
  range.selectNodeContents(cell);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  return range.cloneRange();
}

export function exitBlockElement(block: HTMLElement) {
  const paragraph = document.createElement("p");
  paragraph.appendChild(document.createElement("br"));
  block.parentElement?.insertBefore(paragraph, block.nextSibling);

  const range = document.createRange();
  range.selectNodeContents(paragraph);
  range.collapse(true);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  return range.cloneRange();
}
