import type { Stamp } from "../types";
import { attachStampDragHandlers, createStampRemoveButton, createStampTokenImage } from "./richEditorStampTokenDom";

export function createStampToken(stamp: Stamp, onRemove?: (stampId: string) => void) {
  const token = document.createElement("span");
  token.className = "editorStampToken";
  token.contentEditable = "false";
  token.draggable = true;
  token.dataset.stampId = stamp.id;
  token.title = stamp.title;

  const image = createStampTokenImage(stamp);
  token.appendChild(image);
  token.appendChild(createStampRemoveButton(stamp, onRemove));
  attachStampDragHandlers(token, image, stamp);

  return token;
}
