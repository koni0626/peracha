import {
  rangeForInsertion as resolveRangeForInsertion,
  rangeFromPoint as resolveRangeFromPoint,
} from "./richEditorSelection";
import type { EditorCaretPosition } from "./richEditorSelection";

export type RefLike<T> = {
  current: T;
};

type UseRichEditorRangesOptions = {
  editorRef: RefLike<HTMLDivElement | null>;
  savedBlockPositionRef: RefLike<EditorCaretPosition | null>;
  savedRangeRef: RefLike<Range | null>;
  savedTextOffsetRef: RefLike<number | null>;
};

export function useRichEditorRanges({
  editorRef,
  savedBlockPositionRef,
  savedRangeRef,
  savedTextOffsetRef,
}: UseRichEditorRangesOptions) {
  function rangeForInsertion() {
    const editor = editorRef.current;
    if (!editor) {
      return null;
    }
    return resolveRangeForInsertion(
      editor,
      savedRangeRef.current,
      savedTextOffsetRef.current,
      savedBlockPositionRef.current,
    );
  }

  function rangeFromPoint(x: number, y: number) {
    if (!editorRef.current) {
      return null;
    }
    return resolveRangeFromPoint(editorRef.current, x, y);
  }

  return {
    rangeForInsertion,
    rangeFromPoint,
  };
}
