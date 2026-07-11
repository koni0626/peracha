import { safeMediaSrc } from "./markdownSafety";

export type InlineUploadResult = {
  title: string;
  url: string;
  content_type: string | null;
};

const INLINE_IMAGE_TRANSFER_TYPE = "application/x-editor-image-id";

export function isInlineImageFile(file: File) {
  if (file.type.startsWith("image/")) {
    return true;
  }
  return /\.(avif|gif|jpe?g|png|webp|bmp|svg)$/i.test(file.name);
}

export function createInlineImageElement(result: InlineUploadResult) {
  const image = document.createElement("img");
  image.className = "markdownInlineImage";
  image.src = safeMediaSrc(result.url);
  image.alt = result.title;
  image.title = result.title;
  image.dataset.markdownSrc = result.url;
  image.dataset.uploading = "false";
  prepareInlineImageForDrag(image);
  return image;
}

export function createInlinePreviewImageElement(file: File) {
  const image = document.createElement("img");
  const objectUrl = URL.createObjectURL(file);
  image.className = "markdownInlineImage isUploading";
  image.src = objectUrl;
  image.alt = file.name;
  image.title = "アップロード中";
  image.dataset.objectUrl = objectUrl;
  image.dataset.uploading = "true";
  prepareInlineImageForDrag(image);
  return image;
}

export function completeInlinePreviewImage(image: HTMLImageElement, result: InlineUploadResult) {
  revokeInlinePreviewUrl(image);
  image.classList.remove("isUploading", "isUploadError");
  image.src = safeMediaSrc(result.url);
  image.alt = result.title;
  image.title = result.title;
  image.dataset.markdownSrc = result.url;
  image.dataset.uploading = "false";
  delete image.dataset.objectUrl;
  prepareInlineImageForDrag(image);
}

export function markInlinePreviewImageFailed(image: HTMLImageElement) {
  revokeInlinePreviewUrl(image);
  image.classList.remove("isUploading");
  image.classList.add("isUploadError");
  image.title = "アップロードに失敗しました";
  image.dataset.uploading = "true";
}

export function prepareInlineImageForDrag(image: HTMLImageElement) {
  image.draggable = true;
  image.dataset.editorImageId ||= randomInlineImageId();
}

export function handleInlineImageDragStart(event: DragEvent, editor: HTMLElement | null) {
  const target = event.target instanceof HTMLElement ? event.target.closest<HTMLImageElement>(".markdownInlineImage") : null;
  if (!target || !editor?.contains(target)) {
    return;
  }
  prepareInlineImageForDrag(target);
  event.dataTransfer?.setData(INLINE_IMAGE_TRANSFER_TYPE, target.dataset.editorImageId ?? "");
  event.dataTransfer?.setData("text/plain", target.alt || target.title || "image");
  event.dataTransfer?.setDragImage(target, target.width / 2, target.height / 2);
}

export function inlineImageIdFromTransfer(dataTransfer: DataTransfer) {
  return dataTransfer.getData(INLINE_IMAGE_TRANSFER_TYPE);
}

export function hasInlineImageTransfer(dataTransfer: DataTransfer) {
  return dataTransfer.types.includes(INLINE_IMAGE_TRANSFER_TYPE);
}

export function inlineImageById(editor: HTMLElement, imageId: string) {
  return editor.querySelector<HTMLImageElement>(`.markdownInlineImage[data-editor-image-id="${CSS.escape(imageId)}"]`);
}

export function insertInlineMediaNode(range: Range, node: Node) {
  const spacer = document.createTextNode("\u00a0");
  range.deleteContents();
  range.insertNode(spacer);
  range.insertNode(node);
  return spacer;
}

function revokeInlinePreviewUrl(image: HTMLImageElement) {
  if (image.dataset.objectUrl) {
    URL.revokeObjectURL(image.dataset.objectUrl);
  }
}

function randomInlineImageId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `inline-image-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
