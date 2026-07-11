import type { Stamp } from "../types";
import type { StampExplorerContextMenu as StampExplorerContextMenuState } from "./stampExplorerTypes";
import {
  CreateFolderMenuItem,
  DeleteFolderMenuItem,
  DeleteStampMenuItem,
  UploadImagesMenuItem,
} from "./StampExplorerContextMenuItems";

type StampExplorerContextMenuProps = {
  canManage: boolean;
  contextMenu: StampExplorerContextMenuState;
  uploadFolderId: string | null;
  createFolder: () => void | Promise<void>;
  deleteFolder: (folderId: string) => void | Promise<void>;
  deleteStamp: (stamp: Stamp) => void | Promise<void>;
  onUploadFiles?: (files: File[], folderId: string | null) => void | Promise<void>;
};

export function StampExplorerContextMenu({
  canManage,
  contextMenu,
  uploadFolderId,
  createFolder,
  deleteFolder,
  deleteStamp,
  onUploadFiles,
}: StampExplorerContextMenuProps) {
  return (
    <div className="stampExplorerContextMenu" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={(event) => event.stopPropagation()}>
      {canManage && contextMenu.target === "blank" ? (
        <CreateFolderMenuItem onCreateFolder={createFolder} />
      ) : null}
      {canManage && contextMenu.target === "folder" ? (
        <>
          <CreateFolderMenuItem onCreateFolder={createFolder} />
          <DeleteFolderMenuItem folderId={contextMenu.folderId} onDeleteFolder={deleteFolder} />
        </>
      ) : null}
      {canManage && contextMenu.target === "stamp" ? (
        <DeleteStampMenuItem stamp={contextMenu.stamp} onDeleteStamp={deleteStamp} />
      ) : null}
      {contextMenu.target !== "stamp" && onUploadFiles ? (
        <UploadImagesMenuItem
          folderId={contextMenu.target === "folder" ? contextMenu.folderId : uploadFolderId}
          onUploadFiles={onUploadFiles}
        />
      ) : null}
    </div>
  );
}
