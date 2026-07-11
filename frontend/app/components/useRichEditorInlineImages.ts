import type { DragEvent } from "react";

import {
  completeInlinePreviewImage,
  createInlineImageElement,
  createInlinePreviewImageElement,
  inlineImageById,
  inlineImageIdFromTransfer,
  insertInlineMediaNode,
  isInlineImageFile,
  markInlinePreviewImageFailed,
} from "./richEditorMedia";
import type { InlineUploadResult } from "./richEditorMedia";
import { rangeBlockPosition, rangeTextOffset } from "./richEditorSelection";
import type { EditorCaretPosition } from "./richEditorSelection";
import type { RefLike } from "./useRichEditorRanges";

type UseRichEditorInlineImagesOptions = {
  editorRef: RefLike<HTMLDivElement | null>;
  onUploadInlineFile?: (file: File) => Promise<InlineUploadResult>;
  preferSavedSelectionOnImageDrop: boolean;
  rangeForInsertion: () => Range | null;
  rangeFromPoint: (x: number, y: number) => Range | null;
  savedBlockPositionRef: RefLike<EditorCaretPosition | null>;
  savedRangeRef: RefLike<Range | null>;
  savedTextOffsetRef: RefLike<number | null>;
  selectAfter: (node: Node) => void;
  syncMarkdown: () => void;
  unlockSelectionSaveSoon: () => void;
};

export function useRichEditorInlineImages({
  editorRef,
  onUploadInlineFile,
  preferSavedSelectionOnImageDrop,
  rangeForInsertion,
  rangeFromPoint,
  savedBlockPositionRef,
  savedRangeRef,
  savedTextOffsetRef,
  selectAfter,
  syncMarkdown,
  unlockSelectionSaveSoon,
}: UseRichEditorInlineImagesOptions) {
  function insertInlineImageAtCursor(result: InlineUploadResult) {
    const editor = editorRef.current;
    const range = rangeForInsertion();
    if (!editor || !range) {
      return;
    }
    const image = createInlineImageElement(result);
    const spacer = insertInlineMediaNode(range, image);
    selectAfter(spacer);
    syncMarkdown();
  }

  function insertPreviewImage(file: File) {
    const editor = editorRef.current;
    const range = rangeForInsertion();
    if (!editor || !range) {
      return null;
    }
    const image = createInlinePreviewImageElement(file);
    const spacer = insertInlineMediaNode(range, image);
    selectAfter(spacer);
    syncMarkdown();
    return image;
  }

  async function uploadInlineFilesAtSelection(files: File[]) {
    if (!onUploadInlineFile || files.length === 0) {
      return;
    }
    for (const file of files) {
      const previewImage = insertPreviewImage(file);
      try {
        const result = await onUploadInlineFile(file);
        if (previewImage?.isConnected) {
          completeInlinePreviewImage(previewImage, result);
          selectAfter(previewImage);
          syncMarkdown();
        } else {
          insertInlineImageAtCursor(result);
        }
      } catch (error) {
        if (previewImage?.isConnected) {
          markInlinePreviewImageFailed(previewImage);
        }
        console.error(error);
      }
    }
  }

  function handleInlineImageMove(event: DragEvent<HTMLDivElement>) {
    const editor = editorRef.current;
    const imageId = inlineImageIdFromTransfer(event.dataTransfer);
    if (!editor || !imageId) {
      return false;
    }
    const image = inlineImageById(editor, imageId);
    const range = rangeFromPoint(event.clientX, event.clientY);
    if (!image || !range || image.contains(range.commonAncestorContainer)) {
      return false;
    }
    event.preventDefault();
    event.stopPropagation();
    range.insertNode(image);
    selectAfter(image);
    syncMarkdown();
    unlockSelectionSaveSoon();
    return true;
  }

  function handleImageDrop(event: DragEvent<HTMLDivElement>) {
    try {
      if (handleInlineImageMove(event)) {
        return true;
      }
      const imageFiles = Array.from(event.dataTransfer.files).filter(isInlineImageFile);
      if (imageFiles.length === 0 || !onUploadInlineFile) {
        return false;
      }
      event.preventDefault();
      event.stopPropagation();
      const editor = editorRef.current;
      const savedRangeIsUsable = Boolean(
        editor && savedRangeRef.current && editor.contains(savedRangeRef.current.commonAncestorContainer)
      );
      if (!preferSavedSelectionOnImageDrop || !savedRangeIsUsable) {
        const dropRange = rangeFromPoint(event.clientX, event.clientY);
        if (dropRange) {
          savedRangeRef.current = dropRange.cloneRange();
          if (editor) {
            savedTextOffsetRef.current = rangeTextOffset(editor, dropRange);
            savedBlockPositionRef.current = rangeBlockPosition(editor, dropRange);
          }
        }
      }
      void uploadInlineFilesAtSelection(imageFiles);
      return true;
    } finally {
      unlockSelectionSaveSoon();
    }
  }

  return {
    handleImageDrop,
    uploadInlineFilesAtSelection,
  };
}
