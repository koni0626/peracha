import { useEffect, useState } from "react";

export function isImageFile(file: File) {
  if (file.type.startsWith("image/")) {
    return true;
  }
  return /\.(avif|gif|jpe?g|png|webp|bmp|svg)$/i.test(file.name);
}

export function isVideoFile(file: File) {
  if (file.type.startsWith("video/")) {
    return true;
  }
  return /\.(m4v|mov|mp4|ogg|webm)$/i.test(file.name);
}

export function usePendingAttachmentPreviewUrl(file: File, enabled: boolean) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, enabled]);

  return previewUrl;
}
