import type { Attachment } from "../types";

export function isImageAttachment(attachment: Attachment) {
  if (attachment.content_type?.startsWith("image/")) {
    return true;
  }
  return /\.(avif|gif|jpe?g|png|webp|bmp|svg)$/i.test(attachment.url);
}

export function isVideoAttachment(attachment: Attachment) {
  if (attachment.content_type?.startsWith("video/")) {
    return true;
  }
  return /\.(m4v|mov|mp4|ogg|webm)$/i.test(attachment.url);
}
