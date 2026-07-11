import { RefreshCw, X } from "lucide-react";

import { RoomFolderFileList } from "./RoomFolderFileList";
import { RoomFilePreviewPane } from "./RoomFilePreviewPane";
import type { Room, RoomFile } from "../types";

type RoomFolderModalProps = {
  room: Room;
  files: RoomFile[];
  selectedFile: RoomFile | null;
  filePreviewError: string | null;
  filePreviewUrl: string | null;
  onClose: () => void;
  onPreviewLoadError: (message: string) => void;
  onRefresh: () => void;
  onSelectFile: (file: RoomFile) => void;
};

export function RoomFolderModal({
  room,
  files,
  selectedFile,
  filePreviewError,
  filePreviewUrl,
  onClose,
  onPreviewLoadError,
  onRefresh,
  onSelectFile
}: RoomFolderModalProps) {
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="roomFolderTitle">
      <section className="fileFolderModal">
        <header>
          <div>
            <p className="eyebrow">Room Folder</p>
            <h2 id="roomFolderTitle">{room.name} のフォルダ</h2>
          </div>
          <div className="folderHeaderActions">
            <button type="button" onClick={onRefresh} title="更新">
              <RefreshCw size={16} />
            </button>
            <button type="button" className="iconButton" onClick={onClose} title="閉じる">
              <X size={18} />
            </button>
          </div>
        </header>
        <div className="fileFolderBody">
          <RoomFolderFileList files={files} selectedFile={selectedFile} onSelectFile={onSelectFile} />
          <RoomFilePreviewPane
            file={selectedFile}
            previewError={filePreviewError}
            previewUrl={filePreviewUrl}
            onPreviewLoadError={onPreviewLoadError}
          />
        </div>
      </section>
    </div>
  );
}
