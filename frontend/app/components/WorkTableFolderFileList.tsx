import { UploadCloud } from "lucide-react";

import type { RoomFile, WorkTableFolderValue } from "../types";
import { WorkTableFileThumbnail } from "./WorkTableFilePreview";

type WorkTableFolderFileListProps = {
  folderValue: WorkTableFolderValue;
  selectedFile: RoomFile | null;
  onSelectFile: (fileId: string) => void;
  onClearPreviewError: () => void;
};

export function WorkTableFolderFileList({
  folderValue,
  selectedFile,
  onSelectFile,
  onClearPreviewError,
}: WorkTableFolderFileListProps) {
  return (
    <aside className="workTableFolderFiles">
      <div className="workTableFolderDrop">
        <UploadCloud size={20} />
        <span>ここにドラッグしてアップロード</span>
      </div>
      {folderValue.files.map((file) => (
        <button
          type="button"
          className={selectedFile?.id === file.id ? "active" : ""}
          key={file.id}
          onClick={() => {
            onSelectFile(file.id);
            onClearPreviewError();
          }}
        >
          <span className="workTableFolderFileThumb">
            <WorkTableFileThumbnail file={file} />
          </span>
          <span>
            <strong>{file.original_name}</strong>
            <small>{file.content_type ?? "application/octet-stream"}</small>
          </span>
        </button>
      ))}
      {folderValue.files.length === 0 ? <p>ファイルや画像をドラッグ＆ドロップしてください。</p> : null}
    </aside>
  );
}
