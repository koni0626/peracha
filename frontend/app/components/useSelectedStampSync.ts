import { useEffect, useRef } from "react";

import type { Stamp } from "../types";
import { removeStampTokens } from "./richEditorStampTokens";

type RefLike<T> = {
  current: T;
};

type UseSelectedStampSyncOptions = {
  editorRef: RefLike<HTMLElement | null>;
  insertStampAtCursor: (stamp: Stamp) => void;
  selectedStampIds: string[];
  stamps: Stamp[];
  syncMarkdown: () => void;
};

export function useSelectedStampSync({
  editorRef,
  insertStampAtCursor,
  selectedStampIds,
  stamps,
  syncMarkdown,
}: UseSelectedStampSyncOptions) {
  const previousStampIdsRef = useRef<string[]>(selectedStampIds);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    const previous = previousStampIdsRef.current;
    const added = selectedStampIds.filter((id) => !previous.includes(id));
    const removed = previous.filter((id) => !selectedStampIds.includes(id));

    removed.forEach((stampId) => {
      removeStampTokens(editor, stampId);
    });
    added.forEach((stampId) => {
      const stamp = stamps.find((item) => item.id === stampId);
      if (stamp) {
        insertStampAtCursor(stamp);
      }
    });
    previousStampIdsRef.current = selectedStampIds;
    if (removed.length > 0) {
      syncMarkdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStampIds, stamps]);
}
