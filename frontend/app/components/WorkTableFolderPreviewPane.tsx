import { Download } from "lucide-react";

import { apiUrl } from "../api";
import type { RoomFile } from "../types";
import { WorkTableFolderPreview } from "./WorkTableFilePreview";

type WorkTableFolderPreviewPaneProps = {
  folderPreviewError: string | null;
  selectedFile: RoomFile | null;
  onPreviewError: (message: string | null) => void;
};

export function WorkTableFolderPreviewPane({
  folderPreviewError,
  selectedFile,
  onPreviewError,
}: WorkTableFolderPreviewPaneProps) {
  return (
    <main className="workTableFolderPreview">
      {selectedFile ? (
        <div className="workTableFolderPreviewHeader">
          <div>
            <strong>{selectedFile.original_name}</strong>
            <small>{selectedFile.content_type ?? "application/octet-stream"}</small>
          </div>
          <a href={apiUrl(selectedFile.download_url)} target="_blank" rel="noreferrer">
            <Download size={15} />
            ダウンロード
          </a>
        </div>
      ) : null}
      {folderPreviewError ? <p className="workTableFolderPreviewError">{folderPreviewError}</p> : null}
      <div className="workTableFolderPreviewBody">
        <WorkTableFolderPreview file={selectedFile} onError={onPreviewError} />
      </div>
    </main>
  );
}
