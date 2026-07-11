import { FileText, FolderOpen } from "lucide-react";

import { apiUrl } from "../api";
import { roomFilePreviewUrl } from "../hooks/roomFilesApi";
import type { RoomFile } from "../types";
import { OfficeDocumentPreview } from "./OfficeDocumentPreview";
import { filePreviewSrc, isImageRoomFile, isOfficeRoomFile } from "./workTableValueUtils";

type WorkTableFolderPreviewProps = {
  file: RoomFile | null;
  onError: (message: string | null) => void;
};

export function WorkTableFileThumbnail({ file }: { file: RoomFile }) {
  if (isImageRoomFile(file)) {
    return <img src={filePreviewSrc(file)} alt={file.original_name} />;
  }
  return <FileText size={24} />;
}

export function WorkTableFolderPreview({ file, onError }: WorkTableFolderPreviewProps) {
  if (!file) {
    return (
      <div className="workTableFolderEmpty">
        <FolderOpen size={36} />
        <strong>ファイルを選択してください</strong>
      </div>
    );
  }

  const previewUrl = roomFilePreviewUrl(file);
  if (isImageRoomFile(file)) {
    return <img className="workTableFolderImagePreview" src={filePreviewSrc(file)} alt={file.original_name} />;
  }
  if (file.preview_kind === "video") {
    return <video className="workTableFolderVideoPreview" src={previewUrl ?? undefined} controls preload="metadata" />;
  }
  if (file.preview_kind === "pdf") {
    return <iframe className="workTableFolderPdfPreview" src={previewUrl ?? undefined} title={file.original_name} />;
  }
  if (isOfficeRoomFile(file)) {
    return <OfficeDocumentPreview kind={file.preview_kind} title={file.original_name} url={previewUrl} onError={onError} />;
  }

  return (
    <div className="workTableFolderEmpty">
      <FileText size={36} />
      <strong>プレビュー対象外です</strong>
      <a href={apiUrl(file.download_url)} target="_blank" rel="noreferrer">
        ダウンロードして確認
      </a>
    </div>
  );
}
