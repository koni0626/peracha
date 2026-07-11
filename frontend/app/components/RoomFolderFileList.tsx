import { FileText } from "lucide-react";

import type { RoomFile } from "../types";

type RoomFolderFileListProps = {
  files: RoomFile[];
  selectedFile: RoomFile | null;
  onSelectFile: (file: RoomFile) => void;
};

export function RoomFolderFileList({ files, selectedFile, onSelectFile }: RoomFolderFileListProps) {
  if (files.length === 0) {
    return (
      <div className="fileList">
        <p className="mutedText">このルームに保存されたファイルはまだありません。</p>
      </div>
    );
  }

  return (
    <div className="fileList">
      {files.map((file) => (
        <button
          type="button"
          className={selectedFile?.id === file.id ? "active" : ""}
          key={file.id}
          onClick={() => onSelectFile(file)}
        >
          <FileText size={16} />
          <span>
            <strong>{file.original_name}</strong>
            <small>
              {Math.ceil(file.size_bytes / 1024).toLocaleString("ja-JP")} KB /{" "}
              {new Date(file.created_at).toLocaleString("ja-JP")}
            </small>
          </span>
        </button>
      ))}
    </div>
  );
}
