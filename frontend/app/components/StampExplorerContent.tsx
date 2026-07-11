import type { DragEvent, MouseEvent } from "react";

import type { Stamp } from "../types";
import { StampExplorerGrid } from "./StampExplorerGrid";
import { StampExplorerHeader } from "./StampExplorerHeader";
import type { StampExplorerContextMenu, StampFolderEntry } from "./stampExplorerTypes";

type StampExplorerContentProps = {
  activeFolder: StampFolderEntry | undefined;
  canManage: boolean;
  canUpload: boolean;
  dragActive: boolean;
  selectedStampIds: string[];
  uploadFolderId: string | null;
  uploading: boolean;
  visibleStamps: Stamp[];
  onCreateFolder: () => void | Promise<void>;
  onDrag: (event: DragEvent) => void;
  onDrop: (event: DragEvent) => void | Promise<void>;
  onOpenContextMenu: (event: MouseEvent, menu: StampExplorerContextMenu) => void;
  onOpenStamp?: (stamp: Stamp) => void;
  onUploadFiles?: (files: File[], folderId: string | null) => void | Promise<void>;
  onUseStamp?: (stampId: string) => void;
};

export function StampExplorerContent({
  activeFolder,
  canManage,
  canUpload,
  dragActive,
  selectedStampIds,
  uploadFolderId,
  uploading,
  visibleStamps,
  onCreateFolder,
  onDrag,
  onDrop,
  onOpenContextMenu,
  onOpenStamp,
  onUploadFiles,
  onUseStamp,
}: StampExplorerContentProps) {
  return (
    <section
      className="stampExplorerContent"
      onContextMenu={(event) => onOpenContextMenu(event, { x: event.clientX, y: event.clientY, target: "blank" })}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={(event) => void onDrop(event)}
    >
      <StampExplorerHeader
        canManage={canManage}
        canUpload={canUpload}
        stampCount={visibleStamps.length}
        title={activeFolder?.name ?? "未分類"}
        uploadFolderId={uploadFolderId}
        uploading={uploading}
        onCreateFolder={onCreateFolder}
        onUploadFiles={onUploadFiles}
      />
      <StampExplorerGrid
        canManage={canManage}
        selectedStampIds={selectedStampIds}
        stamps={visibleStamps}
        onOpenContextMenu={onOpenContextMenu}
        onOpenStamp={onOpenStamp}
        onUseStamp={onUseStamp}
      />
      {dragActive ? <div className="stampExplorerDropMask">このフォルダにアップロード</div> : null}
    </section>
  );
}
