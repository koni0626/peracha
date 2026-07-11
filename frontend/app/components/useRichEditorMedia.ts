import type { DragEvent } from "react";

import type { Stamp } from "../types";
import type { InlineUploadResult } from "./richEditorMedia";
import type { EditorCaretPosition } from "./richEditorSelection";
import { useRichEditorInlineImages } from "./useRichEditorInlineImages";
import { useRichEditorRanges } from "./useRichEditorRanges";
import type { RefLike } from "./useRichEditorRanges";
import { useRichEditorStamps } from "./useRichEditorStamps";

type UseRichEditorMediaOptions = {
  editorRef: RefLike<HTMLDivElement | null>;
  onRemoveStamp?: (stampId: string) => void;
  onReorderStamps?: (stampIds: string[]) => void;
  onUploadInlineFile?: (file: File) => Promise<InlineUploadResult>;
  preferSavedSelectionOnImageDrop: boolean;
  savedBlockPositionRef: RefLike<EditorCaretPosition | null>;
  savedRangeRef: RefLike<Range | null>;
  savedTextOffsetRef: RefLike<number | null>;
  selectedStampIds: string[];
  selectAfter: (node: Node) => void;
  stamps: Stamp[];
  syncMarkdown: () => void;
  unlockSelectionSaveSoon: () => void;
};

export function useRichEditorMedia({
  editorRef,
  onRemoveStamp,
  onReorderStamps,
  onUploadInlineFile,
  preferSavedSelectionOnImageDrop,
  savedBlockPositionRef,
  savedRangeRef,
  savedTextOffsetRef,
  selectedStampIds,
  selectAfter,
  stamps,
  syncMarkdown,
  unlockSelectionSaveSoon,
}: UseRichEditorMediaOptions) {
  const { rangeForInsertion, rangeFromPoint } = useRichEditorRanges({
    editorRef,
    savedBlockPositionRef,
    savedRangeRef,
    savedTextOffsetRef,
  });
  const { handleImageDrop, uploadInlineFilesAtSelection } = useRichEditorInlineImages({
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
  });
  const { handleStampDrop } = useRichEditorStamps({
    editorRef,
    onRemoveStamp,
    onReorderStamps,
    rangeForInsertion,
    rangeFromPoint,
    selectedStampIds,
    selectAfter,
    stamps,
    syncMarkdown,
  });

  function handleEditorDrop(event: DragEvent<HTMLDivElement>) {
    if (handleImageDrop(event)) {
      return;
    }
    handleStampDrop(event);
  }

  return {
    handleEditorDrop,
    uploadInlineFilesAtSelection,
  };
}
