import type { ClipboardEvent, DragEvent } from "react";

import { hasInlineImageTransfer, isInlineImageFile } from "./richEditorMedia";
import type { InlineUploadResult } from "./richEditorMedia";

type UseRichEditorSurfaceEventsOptions = {
  lockSelectionSave: () => void;
  onUploadInlineFile?: (file: File) => Promise<InlineUploadResult>;
  saveSelection: () => void;
  syncMarkdown: () => void;
  updateMentionState: () => void;
  uploadInlineFilesAtSelection: (files: File[]) => Promise<void>;
};

export function useRichEditorSurfaceEvents({
  lockSelectionSave,
  onUploadInlineFile,
  saveSelection,
  syncMarkdown,
  updateMentionState,
  uploadInlineFilesAtSelection,
}: UseRichEditorSurfaceEventsOptions) {
  function shouldHandleDrag(event: DragEvent<HTMLDivElement>) {
    return (
      event.dataTransfer.types.includes("application/x-stamp-id") ||
      hasInlineImageTransfer(event.dataTransfer) ||
      event.dataTransfer.types.includes("Files")
    );
  }

  function handleEditorDragEnter(event: DragEvent<HTMLDivElement>) {
    if (shouldHandleDrag(event)) {
      lockSelectionSave();
    }
  }

  function handleEditorDragOver(event: DragEvent<HTMLDivElement>) {
    if (shouldHandleDrag(event)) {
      event.preventDefault();
    }
  }

  function handleEditorPaste(event: ClipboardEvent<HTMLDivElement>) {
    const imageFiles = Array.from(event.clipboardData.files).filter(isInlineImageFile);
    if (imageFiles.length > 0 && onUploadInlineFile) {
      event.preventDefault();
      event.stopPropagation();
      saveSelection();
      void uploadInlineFilesAtSelection(imageFiles);
      return;
    }
    event.preventDefault();
    document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
    saveSelection();
    syncMarkdown();
    updateMentionState();
  }

  return { handleEditorDragEnter, handleEditorDragOver, handleEditorPaste };
}
