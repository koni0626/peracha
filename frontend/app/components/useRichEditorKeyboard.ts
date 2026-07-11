import type { KeyboardEvent, MutableRefObject, RefObject } from "react";

import { handleEditorBlockquoteEnter, handleEditorCodeBlockEnter } from "./richEditorBlockEnter";
import { applyBlockMarkdownShortcut, applyTableMarkdownShortcut } from "./richEditorMarkdownShortcuts";

type UseRichEditorKeyboardOptions = {
  closeMentionSuggestions: () => void;
  editorRef: RefObject<HTMLDivElement | null>;
  handleMentionKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  mentionQuery: string | null;
  saveSelection: () => void;
  savedRangeRef: MutableRefObject<Range | null>;
  syncMarkdown: () => void;
  updateTableEditingState: () => void;
};

export function useRichEditorKeyboard({
  closeMentionSuggestions,
  editorRef,
  handleMentionKeyDown,
  mentionQuery,
  saveSelection,
  savedRangeRef,
  syncMarkdown,
  updateTableEditingState
}: UseRichEditorKeyboardOptions) {
  function handleEditorKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      handleEditorCodeBlockEnter({
        editor: editorRef.current,
        event,
        saveSelection,
        savedRangeRef,
        syncMarkdown,
      })
    ) {
      return;
    }
    if (
      handleEditorBlockquoteEnter({
        editor: editorRef.current,
        event,
        saveSelection,
        savedRangeRef,
        syncMarkdown,
      })
    ) {
      return;
    }
    if (event.key === " " && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const range = editorRef.current ? applyBlockMarkdownShortcut(editorRef.current) : null;
      if (range) {
        event.preventDefault();
        savedRangeRef.current = range;
        closeMentionSuggestions();
        syncMarkdown();
        updateTableEditingState();
        return;
      }
    }
    if (mentionQuery === null) {
      if (event.key === "Enter" && !event.shiftKey) {
        const range = editorRef.current ? applyTableMarkdownShortcut(editorRef.current) : null;
        if (range) {
          event.preventDefault();
          savedRangeRef.current = range;
          syncMarkdown();
          updateTableEditingState();
          return;
        }
      }
      if (event.key === "Enter") {
        window.setTimeout(() => {
          saveSelection();
          syncMarkdown();
          updateTableEditingState();
        }, 0);
      }
      return;
    }
    handleMentionKeyDown(event);
  }

  return { handleEditorKeyDown };
}
