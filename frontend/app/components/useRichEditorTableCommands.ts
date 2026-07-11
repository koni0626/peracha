import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";

import { moveCaretIntoCell, selectedElementFromRange } from "./richEditorDom";
import { editRichEditorTable } from "./richEditorTableEditing";
import type { TableEditAction } from "./RichMarkdownToolbar";

type UseRichEditorTableCommandsOptions = {
  editorRef: RefObject<HTMLDivElement | null>;
  savedRangeRef: MutableRefObject<Range | null>;
  setTableEditing: Dispatch<SetStateAction<boolean>>;
  syncMarkdown: () => void;
};

export function useRichEditorTableCommands({
  editorRef,
  savedRangeRef,
  setTableEditing,
  syncMarkdown
}: UseRichEditorTableCommandsOptions) {
  function selectedElement() {
    return selectedElementFromRange(savedRangeRef.current);
  }

  function currentTableCell() {
    const editor = editorRef.current;
    const element = selectedElement();
    if (!editor || !element || !editor.contains(element)) {
      return null;
    }
    return element.closest("td, th") as HTMLTableCellElement | null;
  }

  function updateTableEditingState() {
    setTableEditing(Boolean(currentTableCell()));
  }

  function selectInsideCell(cell: HTMLTableCellElement | undefined) {
    const range = moveCaretIntoCell(cell);
    if (range) {
      savedRangeRef.current = range;
      setTableEditing(true);
    }
  }

  function editTable(action: TableEditAction) {
    if (editRichEditorTable(action, currentTableCell(), selectInsideCell)) {
      syncMarkdown();
    }
  }

  return { editTable, updateTableEditingState };
}
