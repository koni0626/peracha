import type { Stamp } from "../types";
import { insertInlineMediaNode } from "./richEditorMedia";
import {
  createStampToken,
  moveStampToken,
  orderedSelectedStampIds,
  stampIdFromTransfer,
  stampIdsInEditor,
  stampTokenById,
  targetStampToken,
} from "./richEditorStampTokens";

type InsertRichEditorStampOptions = {
  editor: HTMLElement | null;
  onRemoveStamp?: (stampId: string) => void;
  range: Range | null;
  selectAfter: (node: Node) => void;
  stamp: Stamp;
};

type MoveDroppedStampOptions = {
  clientX: number;
  clientY: number;
  dataTransfer: DataTransfer;
  editor: HTMLElement | null;
  rangeFromPoint: (x: number, y: number) => Range | null;
  selectAfter: (node: Node) => void;
  target: EventTarget | null;
};

export function reportRichEditorStampOrder(
  editor: HTMLElement | null,
  selectedStampIds: string[],
  onReorderStamps?: (stampIds: string[]) => void,
) {
  if (!editor) {
    return;
  }
  onReorderStamps?.(orderedSelectedStampIds(stampIdsInEditor(editor), selectedStampIds));
}

export function insertRichEditorStamp({
  editor,
  onRemoveStamp,
  range,
  selectAfter,
  stamp,
}: InsertRichEditorStampOptions) {
  if (!editor || !range) {
    return false;
  }
  const token = createStampToken(stamp, onRemoveStamp);
  const spacer = insertInlineMediaNode(range, token);
  selectAfter(spacer);
  return true;
}

export function moveDroppedRichEditorStamp({
  clientX,
  clientY,
  dataTransfer,
  editor,
  rangeFromPoint,
  selectAfter,
  target,
}: MoveDroppedStampOptions) {
  const stampId = stampIdFromTransfer(dataTransfer);
  if (!stampId || !editor) {
    return false;
  }
  const token = stampTokenById(editor, stampId);
  if (!token) {
    return false;
  }
  const moved = moveStampToken(editor, token, targetStampToken(target), rangeFromPoint(clientX, clientY));
  if (moved) {
    selectAfter(token);
  }
  return true;
}
