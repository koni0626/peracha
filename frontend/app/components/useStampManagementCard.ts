import { useState } from "react";

import type { Stamp } from "../types";

type UseStampManagementCardOptions = {
  onDeleteStamp: (stampId: string) => void | Promise<void>;
  onUploadStampImage: (file: File, folderId?: string | null) => void | Promise<void>;
};

export function useStampManagementCard({ onDeleteStamp, onUploadStampImage }: UseStampManagementCardOptions) {
  const [previewStamp, setPreviewStamp] = useState<Stamp | null>(null);
  const [deletingStampId, setDeletingStampId] = useState<string | null>(null);

  async function deletePreviewStamp() {
    if (!previewStamp) {
      return;
    }
    setDeletingStampId(previewStamp.id);
    try {
      await onDeleteStamp(previewStamp.id);
      setPreviewStamp(null);
    } catch {
      // onDeleteStamp updates the shared error area.
    } finally {
      setDeletingStampId(null);
    }
  }

  async function uploadFiles(files: File[], folderId: string | null) {
    for (const file of files) {
      await onUploadStampImage(file, folderId);
    }
  }

  return {
    deletingStampId,
    deletePreviewStamp,
    previewStamp,
    setPreviewStamp,
    uploadFiles,
  };
}
