import type { DragEvent } from "react";

export function allowAssetDrop(event: DragEvent<HTMLElement>) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
}

export function handleFileCellDrop(
  event: DragEvent<HTMLElement>,
  onUploadFile: (file: File) => void | Promise<void>,
) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    void onUploadFile(file);
  }
}

export function handleFolderCellDrop(
  event: DragEvent<HTMLElement>,
  onUploadFolderFiles: (files: File[]) => void | Promise<void>,
) {
  event.preventDefault();
  void onUploadFolderFiles(Array.from(event.dataTransfer.files));
}
