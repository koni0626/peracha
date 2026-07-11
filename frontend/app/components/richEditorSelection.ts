export function selectAfterNode(editor: HTMLElement, node: Node) {
  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  return range.cloneRange();
}

export function rangeTextOffset(editor: HTMLElement, range: Range) {
  const beforeRange = document.createRange();
  beforeRange.selectNodeContents(editor);
  beforeRange.setEnd(range.startContainer, range.startOffset);
  return beforeRange.toString().length;
}

export type EditorCaretPosition = {
  blockIndex: number;
  textOffset: number;
};

export function rangeBlockPosition(editor: HTMLElement, range: Range): EditorCaretPosition | null {
  const block = topLevelBlockForRange(editor, range);
  if (!block) {
    return null;
  }
  if (block.node === null) {
    return {
      blockIndex: block.index,
      textOffset: 0,
    };
  }
  const beforeRange = document.createRange();
  beforeRange.selectNodeContents(block.node);
  beforeRange.setEnd(range.startContainer, range.startOffset);
  return {
    blockIndex: block.index,
    textOffset: beforeRange.toString().length,
  };
}

export function rangeFromTextOffset(editor: HTMLElement, offset: number) {
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
  let remaining = Math.max(0, offset);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const textLength = node.textContent?.length ?? 0;
    if (remaining <= textLength) {
      const range = document.createRange();
      range.setStart(node, remaining);
      range.collapse(true);
      return range;
    }
    remaining -= textLength;
  }

  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  return range;
}

export function rangeFromBlockPosition(editor: HTMLElement, position: EditorCaretPosition) {
  const block = ensureTopLevelBlock(editor, position.blockIndex);
  return rangeFromTextOffsetInNode(block, position.textOffset);
}

export function rangeForInsertion(
  editor: HTMLElement,
  savedRange: Range | null,
  savedTextOffset: number | null,
  savedBlockPosition: EditorCaretPosition | null,
) {
  if (savedRange && editor.contains(savedRange.commonAncestorContainer)) {
    return savedRange.cloneRange();
  }
  if (savedBlockPosition) {
    return rangeFromBlockPosition(editor, savedBlockPosition);
  }
  if (savedTextOffset !== null) {
    return rangeFromTextOffset(editor, savedTextOffset);
  }
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  return range;
}

function topLevelBlockForRange(editor: HTMLElement, range: Range) {
  if (range.startContainer === editor) {
    return {
      index: range.startOffset,
      node: editor.childNodes[range.startOffset] ?? null,
    };
  }
  let current: Node | null =
    range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentNode : range.startContainer;
  while (current && current.parentNode !== editor) {
    current = current.parentNode;
  }
  if (!current) {
    return null;
  }
  return {
    index: Array.prototype.indexOf.call(editor.childNodes, current) as number,
    node: current,
  };
}

function ensureTopLevelBlock(editor: HTMLElement, blockIndex: number) {
  let index = Math.max(0, blockIndex);
  if (editor.childNodes.length === 0) {
    editor.appendChild(createEmptyParagraph());
  }
  while (index >= editor.childNodes.length) {
    editor.appendChild(createEmptyParagraph());
  }
  return editor.childNodes[index];
}

function createEmptyParagraph() {
  const paragraph = document.createElement("p");
  paragraph.appendChild(document.createElement("br"));
  return paragraph;
}

function rangeFromTextOffsetInNode(container: Node, offset: number) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let remaining = Math.max(0, offset);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const textLength = node.textContent?.length ?? 0;
    if (remaining <= textLength) {
      const range = document.createRange();
      range.setStart(node, remaining);
      range.collapse(true);
      return range;
    }
    remaining -= textLength;
  }

  const range = document.createRange();
  range.selectNodeContents(container);
  range.collapse(false);
  return range;
}

export function rangeFromPoint(editor: HTMLElement, x: number, y: number) {
  const caretDocument = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  const range =
    caretDocument.caretRangeFromPoint?.(x, y) ??
    (() => {
      const position = caretDocument.caretPositionFromPoint?.(x, y);
      if (!position) {
        return null;
      }
      const nextRange = document.createRange();
      nextRange.setStart(position.offsetNode, position.offset);
      nextRange.collapse(true);
      return nextRange;
    })();
  return range && editor.contains(range.commonAncestorContainer) ? range : null;
}
