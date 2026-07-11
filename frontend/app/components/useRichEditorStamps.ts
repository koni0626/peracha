import type { DragEvent } from "react";

import type { Stamp } from "../types";
import {
  insertRichEditorStamp,
  moveDroppedRichEditorStamp,
  reportRichEditorStampOrder,
} from "./richEditorStampActions";
import type { RefLike } from "./useRichEditorRanges";
import { useSelectedStampSync } from "./useSelectedStampSync";

type UseRichEditorStampsOptions = {
  editorRef: RefLike<HTMLDivElement | null>;
  onRemoveStamp?: (stampId: string) => void;
  onReorderStamps?: (stampIds: string[]) => void;
  rangeForInsertion: () => Range | null;
  rangeFromPoint: (x: number, y: number) => Range | null;
  selectedStampIds: string[];
  selectAfter: (node: Node) => void;
  stamps: Stamp[];
  syncMarkdown: () => void;
};

export function useRichEditorStamps({
  editorRef,
  onRemoveStamp,
  onReorderStamps,
  rangeForInsertion,
  rangeFromPoint,
  selectedStampIds,
  selectAfter,
  stamps,
  syncMarkdown,
}: UseRichEditorStampsOptions) {
  function reportStampOrder() {
    reportRichEditorStampOrder(editorRef.current, selectedStampIds, onReorderStamps);
  }

  function insertStampAtCursor(stamp: Stamp) {
    if (
      insertRichEditorStamp({
        editor: editorRef.current,
        onRemoveStamp,
        range: rangeForInsertion(),
        selectAfter,
        stamp,
      })
    ) {
      syncMarkdown();
      reportStampOrder();
    }
  }

  function handleStampDrop(event: DragEvent<HTMLDivElement>) {
    const moved = moveDroppedRichEditorStamp({
      clientX: event.clientX,
      clientY: event.clientY,
      dataTransfer: event.dataTransfer,
      editor: editorRef.current,
      rangeFromPoint,
      selectAfter,
      target: event.target,
    });
    if (!moved) {
      return false;
    }
    event.preventDefault();
    reportStampOrder();
    syncMarkdown();
    return true;
  }

  useSelectedStampSync({
    editorRef,
    insertStampAtCursor,
    selectedStampIds,
    stamps,
    syncMarkdown,
  });

  return {
    handleStampDrop,
  };
}
