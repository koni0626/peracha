import type { Stamp, StampFolder } from "../types";
import { prependUniqueById, removeById, toggleId } from "./idListUtils";

export function emptyStampLibrary() {
  return {
    folders: [] as StampFolder[],
    stamps: [] as Stamp[],
  };
}

export function upsertStampFolder(folders: StampFolder[], folder: StampFolder) {
  return [...removeById(folders, folder.id), folder].sort((a, b) => a.name.localeCompare(b.name));
}

export function upsertStamp(stamps: Stamp[], stamp: Stamp) {
  return prependUniqueById(stamps, stamp, stamps.length + 1);
}

export function adjustFolderStampCount(folders: StampFolder[], folderId: string | null | undefined, delta: number) {
  if (!folderId) {
    return folders;
  }
  return folders.map((folder) =>
    folder.id === folderId ? { ...folder, stamp_count: Math.max(0, folder.stamp_count + delta) } : folder
  );
}

export function removeStampById(stamps: Stamp[], stampId: string) {
  return removeById(stamps, stampId);
}

export function removeStampFolder(folders: StampFolder[], folderId: string) {
  return removeById(folders, folderId);
}

export function removeStampsInFolder(stamps: Stamp[], folderId: string) {
  return stamps.filter((stamp) => stamp.folder_id !== folderId);
}

export function selectedStampIdsWithoutFolder(selectedIds: string[], stamps: Stamp[], folderId: string) {
  return selectedIds.filter((id) => !stamps.some((stamp) => stamp.id === id && stamp.folder_id === folderId));
}

export function toggleSelectedId(selectedIds: string[], id: string) {
  return toggleId(selectedIds, id);
}

export function reorderSelectedIds(currentIds: string[], orderedIds: string[]) {
  const currentSet = new Set(currentIds);
  const next = orderedIds.filter((id) => currentSet.has(id));
  currentIds.forEach((id) => {
    if (!next.includes(id)) {
      next.push(id);
    }
  });
  return next;
}
