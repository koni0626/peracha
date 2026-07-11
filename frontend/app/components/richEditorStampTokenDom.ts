import { apiUrl } from "../api";
import type { Stamp } from "../types";

export function createStampTokenImage(stamp: Stamp) {
  const image = document.createElement("img");
  image.src = apiUrl(stamp.image_url);
  image.alt = stamp.title;
  image.dataset.markdownSrc = apiUrl(stamp.image_url);
  return image;
}

export function createStampRemoveButton(stamp: Stamp, onRemove?: (stampId: string) => void) {
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "editorStampRemoveButton";
  removeButton.setAttribute("aria-label", "スタンプを外す");
  removeButton.title = "スタンプを外す";
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onRemove?.(stamp.id);
  });
  return removeButton;
}

export function attachStampDragHandlers(token: HTMLElement, image: HTMLImageElement, stamp: Stamp) {
  token.addEventListener("dragstart", (event) => {
    event.dataTransfer?.setData("application/x-stamp-id", stamp.id);
    event.dataTransfer?.setData("text/plain", stamp.id);
    event.dataTransfer?.setDragImage(image, image.width / 2, image.height / 2);
  });
}
