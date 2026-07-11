import type { Dispatch, SetStateAction } from "react";

import { useComposerDragDrop } from "./useComposerDragDrop";

type UseComposerAttachmentsOptions = {
  activeRoomId: string | null;
  setPendingFiles: Dispatch<SetStateAction<File[]>>;
};

export function useComposerAttachments({ activeRoomId, setPendingFiles }: UseComposerAttachmentsOptions) {
  function addFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }
    setPendingFiles((current) => [...current, ...files]);
  }

  function removePendingFile(index: number) {
    setPendingFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  }

  const dragDrop = useComposerDragDrop({ activeRoomId, addFiles });

  return {
    ...dragDrop,
    removePendingFile,
  };
}
