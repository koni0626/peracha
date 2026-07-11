import { UploadCloud } from "lucide-react";

import { apiUrl } from "../api";
import type { RoomFile, WorkTableColumn } from "../types";
import { WorkTableFileThumbnail } from "./WorkTableFilePreview";

export function WorkTableUploadStatus({ uploading }: { uploading: boolean }) {
  return uploading ? <small>アップロード中</small> : null;
}

export function WorkTableFileDropPrompt({ column }: { column: WorkTableColumn }) {
  return (
    <>
      <UploadCloud size={20} />
      <span>{column.field_type === "image" ? "画像をドロップ" : "ファイルをドロップ"}</span>
    </>
  );
}

export function WorkTableAttachedFile({ file }: { file: RoomFile }) {
  return (
    <>
      <div className="workTableFileThumb">
        <WorkTableFileThumbnail file={file} />
      </div>
      <a href={apiUrl(file.download_url)} target="_blank" rel="noreferrer" title={file.original_name}>
        {file.original_name}
      </a>
    </>
  );
}

export function workTableFolderLabel(fileCount: number) {
  return fileCount ? `${fileCount}件` : "フォルダを開く";
}
