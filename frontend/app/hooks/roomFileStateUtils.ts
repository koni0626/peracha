import type { RoomFile } from "../types";
import { pickCurrentOrFirstItem } from "./idListUtils";
import { roomFilePreviewUrl } from "./roomFilesApi";

export function nextSelectedRoomFile(files: RoomFile[], currentId: string | null) {
  return pickCurrentOrFirstItem(files, currentId);
}

export function roomFilePreviewState(file: RoomFile | null) {
  return {
    error: null,
    url: file ? roomFilePreviewUrl(file) : null,
  };
}
