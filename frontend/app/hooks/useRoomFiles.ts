"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { RoomContextMenu, RoomFile } from "../types";
import { getErrorMessage } from "./mutationRunner";
import { nextSelectedRoomFile, roomFilePreviewState } from "./roomFileStateUtils";
import { fetchRoomFiles, uploadFileToRoom } from "./roomFilesApi";

type UseRoomFilesOptions = {
  activeRoomId: string | null;
  setActiveRoomId: (roomId: string | null) => void;
  setError: (message: string | null) => void;
  setRoomContextMenu: Dispatch<SetStateAction<RoomContextMenu | null>>;
};

export function useRoomFiles({ activeRoomId, setActiveRoomId, setError, setRoomContextMenu }: UseRoomFilesOptions) {
  const [roomFolderOpen, setRoomFolderOpen] = useState(false);
  const [roomFiles, setRoomFiles] = useState<RoomFile[]>([]);
  const [selectedRoomFile, setSelectedRoomFile] = useState<RoomFile | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [filePreviewError, setFilePreviewError] = useState<string | null>(null);

  useEffect(() => {
    const preview = roomFilePreviewState(selectedRoomFile);
    setFilePreviewUrl(preview.url);
    setFilePreviewError(preview.error);
  }, [selectedRoomFile]);

  async function loadRoomFiles(roomId = activeRoomId) {
    if (!roomId) {
      return;
    }
    setError(null);
    try {
      const data = await fetchRoomFiles(roomId);
      setRoomFiles(data.items);
      setSelectedRoomFile((current) => nextSelectedRoomFile(data.items, current?.id ?? null));
    } catch (err) {
      setError(getErrorMessage(err, "ファイル一覧の取得に失敗しました"));
    }
  }

  async function openRoomFolder(roomId: string) {
    setRoomContextMenu(null);
    setActiveRoomId(roomId);
    setRoomFolderOpen(true);
    setSelectedRoomFile(null);
    setFilePreviewUrl(null);
    setFilePreviewError(null);
    await loadRoomFiles(roomId);
  }

  async function uploadRoomFile(file: File, roomId = activeRoomId) {
    if (!roomId) {
      throw new Error("ルームを選択してください");
    }
    return uploadFileToRoom(roomId, file);
  }

  return {
    roomFolderOpen,
    setRoomFolderOpen,
    roomFiles,
    selectedRoomFile,
    setSelectedRoomFile,
    filePreviewUrl,
    filePreviewError,
    setFilePreviewError,
    loadRoomFiles,
    openRoomFolder,
    uploadRoomFile
  };
}
