import { useState } from "react";
import type { DragEvent } from "react";

import { imageFiles } from "./stampExplorerTypes";

type UseStampExplorerDragDropOptions = {
  onUploadFiles?: (files: File[], folderId: string | null) => void | Promise<void>;
  uploadFolderId: string | null;
};

export function useStampExplorerDragDrop({ onUploadFiles, uploadFolderId }: UseStampExplorerDragDropOptions) {
  const [dragActive, setDragActive] = useState(false);

  function handleDrag(event: DragEvent) {
    if (!onUploadFiles) {
      return;
    }
    event.preventDefault();
    setDragActive(event.type !== "dragleave");
  }

  async function handleDrop(event: DragEvent) {
    if (!onUploadFiles) {
      return;
    }
    event.preventDefault();
    setDragActive(false);
    const files = imageFiles(Array.from(event.dataTransfer.files));
    if (files.length > 0) {
      await onUploadFiles(files, uploadFolderId);
    }
  }

  return {
    dragActive,
    handleDrag,
    handleDrop,
  };
}
