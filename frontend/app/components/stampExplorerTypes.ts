import type { Stamp, StampFolder } from "../types";

export const ROOT_FOLDER_ID = "__root__";

export type StampFolderEntry = {
  count: number;
  id: string | null;
  name: string;
};

export type StampExplorerContextMenu =
  | { target: "blank"; x: number; y: number }
  | { folderId: string; target: "folder"; x: number; y: number }
  | { stamp: Stamp; target: "stamp"; x: number; y: number };

export type StampExplorerProps = {
  activeFolderId: string | null;
  mode: "manage" | "select";
  selectedStampIds?: string[];
  stampFolders: StampFolder[];
  stamps: Stamp[];
  uploading?: boolean;
  onCreateFolder?: (name: string) => void | Promise<void>;
  onDeleteFolder?: (folderId: string) => void | Promise<void>;
  onDeleteStamp?: (stampId: string) => void | Promise<void>;
  onOpenStamp?: (stamp: Stamp) => void;
  onSelectFolder: (folderId: string | null) => void;
  onUploadFiles?: (files: File[], folderId: string | null) => void | Promise<void>;
  onUseStamp?: (stampId: string) => void;
};

export function imageFiles(files: File[]) {
  return files.filter((file) => file.type.startsWith("image/") || /\.(avif|gif|jpe?g|png|webp)$/i.test(file.name));
}
