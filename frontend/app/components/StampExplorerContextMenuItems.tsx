import { FolderPlus, Trash2 } from "lucide-react";

import type { Stamp } from "../types";
import { StampImageUploadLabel } from "./StampImageUploadLabel";

type CreateFolderMenuItemProps = {
  onCreateFolder: () => void | Promise<void>;
};

type DeleteFolderMenuItemProps = {
  folderId: string;
  onDeleteFolder: (folderId: string) => void | Promise<void>;
};

type DeleteStampMenuItemProps = {
  stamp: Stamp;
  onDeleteStamp: (stamp: Stamp) => void | Promise<void>;
};

type UploadImagesMenuItemProps = {
  folderId: string | null;
  onUploadFiles: (files: File[], folderId: string | null) => void | Promise<void>;
};

export function CreateFolderMenuItem({ onCreateFolder }: CreateFolderMenuItemProps) {
  return (
    <button type="button" onClick={onCreateFolder}>
      <FolderPlus size={15} />
      フォルダを作成
    </button>
  );
}

export function DeleteFolderMenuItem({ folderId, onDeleteFolder }: DeleteFolderMenuItemProps) {
  return (
    <button type="button" className="dangerMenuItem" onClick={() => onDeleteFolder(folderId)}>
      <Trash2 size={15} />
      フォルダを削除
    </button>
  );
}

export function DeleteStampMenuItem({ stamp, onDeleteStamp }: DeleteStampMenuItemProps) {
  return (
    <button type="button" className="dangerMenuItem" onClick={() => onDeleteStamp(stamp)}>
      <Trash2 size={15} />
      ファイルを削除
    </button>
  );
}

export function UploadImagesMenuItem({ folderId, onUploadFiles }: UploadImagesMenuItemProps) {
  return <StampImageUploadLabel folderId={folderId} onUploadFiles={onUploadFiles} />;
}
