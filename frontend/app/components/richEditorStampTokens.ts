export { createStampToken } from "./richEditorStampTokenCreate";

export function stampIdsInEditor(editor: HTMLElement) {
  return Array.from(editor.querySelectorAll<HTMLElement>(".editorStampToken"))
    .map((node) => node.dataset.stampId)
    .filter((id): id is string => Boolean(id));
}

export function stampIdFromTransfer(dataTransfer: DataTransfer) {
  return dataTransfer.getData("application/x-stamp-id");
}

export function stampTokenById(editor: HTMLElement, stampId: string) {
  return editor.querySelector<HTMLElement>(`.editorStampToken[data-stamp-id="${CSS.escape(stampId)}"]`);
}

export function targetStampToken(target: EventTarget | null) {
  return target instanceof HTMLElement ? target.closest<HTMLElement>(".editorStampToken") : null;
}

export function moveStampToken(editor: HTMLElement, token: HTMLElement, targetToken: HTMLElement | null, range: Range | null) {
  if (targetToken && targetToken !== token) {
    editor.insertBefore(token, targetToken);
    return true;
  }
  if (range) {
    range.insertNode(token);
    return true;
  }
  return false;
}

export function removeStampTokens(editor: HTMLElement, stampId: string) {
  editor.querySelectorAll<HTMLElement>(`.editorStampToken[data-stamp-id="${CSS.escape(stampId)}"]`).forEach((node) => {
    node.remove();
  });
}

export function orderedSelectedStampIds(editorStampIds: string[], selectedStampIds: string[]) {
  const known = new Set(selectedStampIds);
  const next = editorStampIds.filter((id) => known.has(id));
  selectedStampIds.forEach((id) => {
    if (!next.includes(id)) {
      next.push(id);
    }
  });
  return next;
}
