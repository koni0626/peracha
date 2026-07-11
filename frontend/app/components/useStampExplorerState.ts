import { useMemo } from "react";

import type { Stamp, StampFolder } from "../types";
import type { StampFolderEntry } from "./stampExplorerTypes";
import { ROOT_FOLDER_ID } from "./stampExplorerTypes";

type UseStampExplorerStateOptions = {
  activeFolderId: string | null;
  mode: "manage" | "select";
  onUploadFiles?: (files: File[], folderId: string | null) => void | Promise<void>;
  stampFolders: StampFolder[];
  stamps: Stamp[];
};

export function useStampExplorerState({
  activeFolderId,
  mode,
  onUploadFiles,
  stampFolders,
  stamps,
}: UseStampExplorerStateOptions) {
  const folders = useMemo<StampFolderEntry[]>(() => {
    const uncategorizedCount = stamps.filter((stamp) => !stamp.folder_id).length;
    return [
      { id: null, name: "未分類", count: uncategorizedCount },
      ...stampFolders.map((folder) => ({ id: folder.id, name: folder.name, count: folder.stamp_count })),
    ];
  }, [stampFolders, stamps]);
  const rootActive = activeFolderId === ROOT_FOLDER_ID;
  const visibleStamps = rootActive
    ? stamps
    : activeFolderId
      ? stamps.filter((stamp) => stamp.folder_id === activeFolderId)
      : stamps.filter((stamp) => !stamp.folder_id);
  const activeFolder = rootActive
    ? { id: ROOT_FOLDER_ID, name: "スタンプ", count: stamps.length }
    : folders.find((folder) => folder.id === activeFolderId) ?? folders[0];

  return {
    activeFolder,
    canManage: mode === "manage",
    canUpload: Boolean(onUploadFiles),
    folders,
    rootActive,
    uploadFolderId: rootActive ? null : activeFolderId,
    visibleStamps,
  };
}
