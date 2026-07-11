import type { KeyboardEvent, MutableRefObject } from "react";

import { exitBlockElement, selectionElementInEditor } from "./richEditorDom";

type HandleBlockEnterOptions<T extends HTMLElement> = {
  block: T | null;
  event: KeyboardEvent<HTMLDivElement>;
  saveSelection: () => void;
  savedRangeRef: MutableRefObject<Range | null>;
  syncMarkdown: () => void;
};

export function handleExitBlockEnter<T extends HTMLElement>({
  block,
  event,
  saveSelection,
  savedRangeRef,
  syncMarkdown,
}: HandleBlockEnterOptions<T>) {
  if (event.key !== "Enter" || !block) {
    return false;
  }
  event.preventDefault();
  if (event.shiftKey) {
    document.execCommand("insertLineBreak");
    saveSelection();
  } else {
    savedRangeRef.current = exitBlockElement(block);
  }
  syncMarkdown();
  return true;
}

type HandleEditorBlockEnterOptions = {
  editor: HTMLDivElement | null;
  event: KeyboardEvent<HTMLDivElement>;
  saveSelection: () => void;
  savedRangeRef: MutableRefObject<Range | null>;
  syncMarkdown: () => void;
};

export function handleEditorCodeBlockEnter(options: HandleEditorBlockEnterOptions) {
  const block = selectionElementInEditor(options.editor)?.closest("pre") as HTMLPreElement | null;
  return handleExitBlockEnter({ ...options, block });
}

export function handleEditorBlockquoteEnter(options: HandleEditorBlockEnterOptions) {
  const block = selectionElementInEditor(options.editor)?.closest("blockquote") as HTMLQuoteElement | null;
  return handleExitBlockEnter({ ...options, block });
}
