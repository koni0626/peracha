"use client";

import { apiFetch, apiUrl, throwResponseError } from "../api";
import type { Page, RoomFile } from "../types";

export function fetchRoomFiles(roomId: string) {
  return apiFetch<Page<RoomFile>>(`/api/rooms/${roomId}/files`);
}

export async function uploadFileToRoom(roomId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(apiUrl(`/api/rooms/${roomId}/files`), {
    method: "POST",
    credentials: "include",
    body: formData
  });
  if (!response.ok) {
    await throwResponseError(response, "ファイルのアップロードに失敗しました");
  }
  return response.json() as Promise<RoomFile>;
}

export function roomFilePreviewUrl(file: RoomFile) {
  return isPreviewableRoomFile(file) ? apiUrl(file.download_url) : null;
}

function isPreviewableRoomFile(file: RoomFile) {
  return ["pdf", "image", "video", "docx", "xlsx", "pptx"].includes(file.preview_kind);
}
