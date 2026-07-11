"use client";

import { StampExplorerContent } from "./StampExplorerContent";
import { StampExplorerContextMenu } from "./StampExplorerContextMenu";
import { StampExplorerSidebar } from "./StampExplorerSidebar";
import type { StampExplorerProps } from "./stampExplorerTypes";
import { useStampExplorerMenu } from "./useStampExplorerMenu";
import { useStampExplorerDragDrop } from "./useStampExplorerDragDrop";
import { useStampExplorerState } from "./useStampExplorerState";

export function StampExplorer({
  activeFolderId,
  mode,
  selectedStampIds = [],
  stampFolders,
  stamps,
  uploading = false,
  onCreateFolder,
  onDeleteFolder,
  onDeleteStamp,
  onOpenStamp,
  onSelectFolder,
  onUploadFiles,
  onUseStamp,
}: StampExplorerProps) {
  const {
    activeFolder,
    canManage,
    canUpload,
    folders,
    rootActive,
    uploadFolderId,
    visibleStamps,
  } = useStampExplorerState({
    activeFolderId,
    mode,
    onUploadFiles,
    stampFolders,
    stamps,
  });
  const { contextMenu, createFolder, deleteFolder, deleteStamp, openContextMenu } = useStampExplorerMenu({
    canManage,
    canUpload,
    onCreateFolder,
    onDeleteFolder,
    onDeleteStamp,
    stampFolders,
  });
  const { dragActive, handleDrag, handleDrop } = useStampExplorerDragDrop({ onUploadFiles, uploadFolderId });

  return (
    <div className={`stampExplorer ${dragActive ? "isDragActive" : ""}`}>
      <StampExplorerSidebar
        activeFolderId={activeFolderId}
        folders={folders}
        rootActive={rootActive}
        stampCount={stamps.length}
        onOpenContextMenu={openContextMenu}
        onSelectFolder={onSelectFolder}
      />

      <StampExplorerContent
        activeFolder={activeFolder}
        canManage={canManage}
        canUpload={canUpload}
        dragActive={dragActive}
        selectedStampIds={selectedStampIds}
        uploadFolderId={uploadFolderId}
        uploading={uploading}
        visibleStamps={visibleStamps}
        onCreateFolder={createFolder}
        onDrag={handleDrag}
        onDrop={handleDrop}
        onOpenContextMenu={openContextMenu}
        onOpenStamp={onOpenStamp}
        onUploadFiles={onUploadFiles}
        onUseStamp={onUseStamp}
      />

      {contextMenu ? (
        <StampExplorerContextMenu
          canManage={canManage}
          contextMenu={contextMenu}
          uploadFolderId={uploadFolderId}
          createFolder={createFolder}
          deleteFolder={deleteFolder}
          deleteStamp={deleteStamp}
          onUploadFiles={onUploadFiles}
        />
      ) : null}
    </div>
  );
}
