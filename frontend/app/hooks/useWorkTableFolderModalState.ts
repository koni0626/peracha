import { useState } from "react";

import type { FolderModalState } from "../components/workTablePanelTypes";

export function useWorkTableFolderModalState() {
  const [folderModal, setFolderModal] = useState<FolderModalState | null>(null);
  const [folderSelectedFileId, setFolderSelectedFileId] = useState<string | null>(null);
  const [folderPreviewError, setFolderPreviewError] = useState<string | null>(null);
  const [uploadingCellKey, setUploadingCellKey] = useState<string | null>(null);

  return {
    folderModal,
    folderPreviewError,
    folderSelectedFileId,
    uploadingCellKey,
    setFolderModal,
    setFolderPreviewError,
    setFolderSelectedFileId,
    setUploadingCellKey,
  };
}
