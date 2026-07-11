"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Stamp, StampFolder } from "../types";
import { useStampDeletion } from "./useStampDeletion";
import { useStampFolderCreation } from "./useStampFolderCreation";
import { useSelectedStamps } from "./useSelectedStamps";
import { useStampLibraryLoader } from "./useStampLibraryLoader";
import { useStampUpload } from "./useStampUpload";

type UseStampManagerOptions = {
  activeRoomId: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  userId: string | null;
};

export function useStampManager({ activeRoomId, setError, userId }: UseStampManagerOptions) {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [stampFolders, setStampFolders] = useState<StampFolder[]>([]);
  const selectedStamps = useSelectedStamps();
  const [selectedUploadFolderId, setSelectedUploadFolderId] = useState<string | null>(null);
  const stampFolderCreation = useStampFolderCreation({
    setError,
    setSelectedUploadFolderId,
    setStampFolders,
  });
  const { loadStamps } = useStampLibraryLoader({
    clearSelectedStamps: selectedStamps.clearSelectedStamps,
    setError,
    setStampFolders,
    setStamps,
    userId,
  });
  const { stampUploading, uploadStampImage } = useStampUpload({
    selectedUploadFolderId,
    setError,
    setStampFolders,
    setStamps,
  });
  const { deleteStamp, deleteStampFolder } = useStampDeletion({
    selectedUploadFolderId,
    setError,
    setSelectedStampIds: selectedStamps.setSelectedStampIds,
    setSelectedUploadFolderId,
    setStampFolders,
    setStamps,
    stampFolders,
    stamps,
  });

  useEffect(() => {
    loadStamps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId, userId]);

  return {
    addStampFolder: stampFolderCreation.addStampFolder,
    clearSelectedStamps: selectedStamps.clearSelectedStamps,
    createFolderByName: stampFolderCreation.createFolderByName,
    deleteStamp,
    deleteStampFolder,
    newStampFolderName: stampFolderCreation.newStampFolderName,
    selectedStampIds: selectedStamps.selectedStampIds,
    selectedUploadFolderId,
    setNewStampFolderName: stampFolderCreation.setNewStampFolderName,
    setSelectedUploadFolderId,
    stampFolderCreating: stampFolderCreation.stampFolderCreating,
    stampFolders,
    stamps,
    stampUploading,
    reorderSelectedStamps: selectedStamps.reorderSelectedStamps,
    toggleStamp: selectedStamps.toggleStamp,
    uploadStampImage,
  };
}
