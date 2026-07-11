import { useRef } from "react";

import { rangeBlockPosition, rangeTextOffset, selectAfterNode } from "./richEditorSelection";
import type { EditorCaretPosition } from "./richEditorSelection";
import { editorHtmlToMarkdown, markdownToEditorHtml } from "./richMarkdownTransforms";

type UseRichEditorContentOptions = {
  onChange: (value: string) => void;
  value: string;
};

export function useRichEditorContent({ onChange, value }: UseRichEditorContentOptions) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastMarkdownRef = useRef(value);
  const savedRangeRef = useRef<Range | null>(null);
  const savedTextOffsetRef = useRef<number | null>(null);
  const savedBlockPositionRef = useRef<EditorCaretPosition | null>(null);
  const selectionSaveLockedRef = useRef(false);

  function saveSelection() {
    if (selectionSaveLockedRef.current) {
      return;
    }
    saveCurrentSelection();
  }

  function saveCurrentSelection() {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) {
      return;
    }
    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange();
      savedTextOffsetRef.current = rangeTextOffset(editor, range);
      savedBlockPositionRef.current = rangeBlockPosition(editor, range);
    }
  }

  function lockSelectionSave() {
    selectionSaveLockedRef.current = true;
  }

  function unlockSelectionSaveSoon() {
    window.setTimeout(() => {
      selectionSaveLockedRef.current = false;
    }, 80);
  }

  function selectAfter(node: Node) {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    const range = selectAfterNode(editor, node);
    savedRangeRef.current = range;
    savedTextOffsetRef.current = rangeTextOffset(editor, range);
    savedBlockPositionRef.current = rangeBlockPosition(editor, range);
  }

  function syncExternalValue(onApplied?: () => void) {
    if (!editorRef.current || lastMarkdownRef.current === value) {
      return;
    }
    editorRef.current.innerHTML = markdownToEditorHtml(value);
    lastMarkdownRef.current = value;
    onApplied?.();
  }

  function ensureEditorHtml() {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = markdownToEditorHtml(value);
    }
  }

  function syncMarkdown(formatEditor = false) {
    if (!editorRef.current) {
      return;
    }
    const markdown = editorHtmlToMarkdown(editorRef.current);
    lastMarkdownRef.current = markdown;
    onChange(markdown);
    if (
      formatEditor &&
      !editorRef.current.querySelector(".editorStampToken, .editorMentionToken, .editorUploadPlaceholder")
    ) {
      editorRef.current.innerHTML = markdownToEditorHtml(markdown);
    }
  }

  return {
    editorRef,
    savedRangeRef,
    savedTextOffsetRef,
    savedBlockPositionRef,
    ensureEditorHtml,
    saveSelection,
    lockSelectionSave,
    selectAfter,
    syncExternalValue,
    syncMarkdown,
    unlockSelectionSaveSoon,
  };
}
