import type { Dispatch, SetStateAction } from "react";

import type { Stamp, StampFolder } from "../types";
import { removeId } from "./idListUtils";
import { getErrorMessage } from "./mutationRunner";
import { deleteStampById, deleteStampFolderById } from "./stampApi";
import {
  adjustFolderStampCount,
  removeStampById,
  removeStampFolder,
  removeStampsInFolder,
  selectedStampIdsWithoutFolder,
} from "./stampStateUtils";

type UseStampDeletionOptions = {
  selectedUploadFolderId: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setSelectedStampIds: Dispatch<SetStateAction<string[]>>;
  setSelectedUploadFolderId: Dispatch<SetStateAction<string | null>>;
  setStampFolders: Dispatch<SetStateAction<StampFolder[]>>;
  setStamps: Dispatch<SetStateAction<Stamp[]>>;
  stampFolders: StampFolder[];
  stamps: Stamp[];
};

export function useStampDeletion({
  selectedUploadFolderId,
  setError,
  setSelectedStampIds,
  setSelectedUploadFolderId,
  setStampFolders,
  setStamps,
  stampFolders,
  stamps,
}: UseStampDeletionOptions) {
  async function deleteStamp(stampId: string) {
    const target = stamps.find((stamp) => stamp.id === stampId);
    setError(null);
    try {
      await deleteStampById(stampId);
      setStamps((current) => removeStampById(current, stampId));
      setSelectedStampIds((current) => removeId(current, stampId));
      setStampFolders((current) => adjustFolderStampCount(current, target?.folder_id, -1));
    } catch (err) {
      setError(getErrorMessage(err, "スタンプの削除に失敗しました"));
      throw err;
    }
  }

  async function deleteStampFolder(folderId: string) {
    const folder = stampFolders.find((item) => item.id === folderId);
    setError(null);
    try {
      await deleteStampFolderById(folderId);
      setStampFolders((current) => removeStampFolder(current, folderId));
      setStamps((current) => removeStampsInFolder(current, folderId));
      setSelectedStampIds((current) => selectedStampIdsWithoutFolder(current, stamps, folderId));
      if (selectedUploadFolderId === folderId) {
        setSelectedUploadFolderId(null);
      }
    } catch (err) {
      setError(getErrorMessage(err, `スタンプフォルダ${folder ? `「${folder.name}」` : ""}の削除に失敗しました`));
      throw err;
    }
  }

  return {
    deleteStamp,
    deleteStampFolder,
  };
}
