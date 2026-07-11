export function currentBlock(editor: HTMLElement, range: Range) {
  const node = range.startContainer instanceof HTMLElement ? range.startContainer : range.startContainer.parentElement;
  const block = node?.closest("p, h1, h2, h3, blockquote, li, div");
  return block instanceof HTMLElement && editor.contains(block) ? block : editor;
}

export function textBeforeCaretInBlock(block: HTMLElement, range: Range) {
  const beforeCaret = range.cloneRange();
  beforeCaret.selectNodeContents(block);
  beforeCaret.setEnd(range.startContainer, range.startOffset);
  return beforeCaret.toString().replace(/\u00a0/g, " ");
}

export function placeCursorIn(node: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  return range.cloneRange();
}

export function replaceBlock(editor: HTMLElement, block: HTMLElement, nextBlock: HTMLElement) {
  return replaceBlockWithCursorTarget(editor, block, nextBlock, nextBlock);
}

export function replaceBlockWithCursorTarget(
  editor: HTMLElement,
  block: HTMLElement,
  nextBlock: HTMLElement,
  cursorTarget: HTMLElement
) {
  if (block === editor) {
    editor.replaceChildren(nextBlock);
  } else {
    block.replaceWith(nextBlock);
  }
  return placeCursorIn(cursorTarget);
}

export function emptyBlock(tagName: string) {
  const block = document.createElement(tagName);
  block.appendChild(document.createElement("br"));
  return block;
}

export function isEmptyAfterMarker(block: HTMLElement, range: Range) {
  const afterCaret = range.cloneRange();
  afterCaret.selectNodeContents(block);
  afterCaret.setStart(range.endContainer, range.endOffset);
  return afterCaret.toString().trim() === "";
}
