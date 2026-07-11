"use client";

import { apiFetch, apiUrl, throwResponseError } from "../api";
import type { Page, Stamp, StampFolder } from "../types";

export function fetchStamps() {
  return apiFetch<Page<Stamp>>("/api/stamps");
}

export function fetchStampFolders() {
  return apiFetch<Page<StampFolder>>("/api/stamps/folders");
}

export async function loadStampLibrary() {
  const [stampData, folderData] = await Promise.all([fetchStamps(), fetchStampFolders()]);
  return {
    folders: folderData.items,
    stamps: stampData.items,
  };
}

export async function createStampFolder(name: string) {
  return apiFetch<StampFolder>("/api/stamps/folders", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function deleteStampFolderById(folderId: string) {
  const response = await fetch(apiUrl(`/api/stamps/folders/${folderId}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    await throwResponseError(response, "スタンプフォルダの削除に失敗しました");
  }
}

export async function uploadStampFile(file: File, folderId: string | null) {
  const formData = new FormData();
  formData.append("file", file);
  if (folderId) {
    formData.append("folder_id", folderId);
  }

  const response = await fetch(apiUrl("/api/stamps/upload"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    await throwResponseError(response, "スタンプ画像のアップロードに失敗しました");
  }
  return response.json() as Promise<Stamp>;
}

export async function deleteStampById(stampId: string) {
  const response = await fetch(apiUrl(`/api/stamps/${stampId}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    await throwResponseError(response, "スタンプの削除に失敗しました");
  }
}
