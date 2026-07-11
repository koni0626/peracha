import { FolderPlus } from "lucide-react";

import { StampImageUploadLabel } from "./StampImageUploadLabel";

type StampExplorerHeaderProps = {
  canManage: boolean;
  canUpload: boolean;
  stampCount: number;
  title: string;
  uploadFolderId: string | null;
  uploading: boolean;
  onCreateFolder: () => void | Promise<void>;
  onUploadFiles?: (files: File[], folderId: string | null) => void | Promise<void>;
};

export function StampExplorerHeader({
  canManage,
  canUpload,
  stampCount,
  title,
  uploadFolderId,
  uploading,
  onCreateFolder,
  onUploadFiles,
}: StampExplorerHeaderProps) {
  return (
    <header className="stampExplorerHeader">
      <div className="stampExplorerTitle">
        <strong>{title}</strong>
        <span>{stampCount} 件</span>
      </div>
      {canManage || canUpload ? (
        <div className="stampExplorerHeaderActions">
          <small>{uploading ? "アップロード中" : "画像をここにドロップ"}</small>
          {canManage ? (
            <button type="button" onClick={onCreateFolder}>
              <FolderPlus size={15} />
              新規フォルダ
            </button>
          ) : null}
          {onUploadFiles ? (
            <StampImageUploadLabel folderId={uploadFolderId} onUploadFiles={onUploadFiles} />
          ) : null}
        </div>
      ) : (
        <small>画像をダブルクリック</small>
      )}
    </header>
  );
}
