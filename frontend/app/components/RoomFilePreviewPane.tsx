import { Download } from "lucide-react";

import { apiUrl } from "../api";
import type { RoomFile } from "../types";
import { RoomFilePreviewBody } from "./RoomFilePreviewBody";
import { RoomFilePreviewNotice } from "./RoomFilePreviewNotice";

type RoomFilePreviewPaneProps = {
  file: RoomFile | null;
  previewError: string | null;
  previewUrl: string | null;
  onPreviewLoadError: (message: string) => void;
};

export function RoomFilePreviewPane({ file, previewError, previewUrl, onPreviewLoadError }: RoomFilePreviewPaneProps) {
  if (!file) {
    return (
      <div className="filePreviewPane">
        <RoomFilePreviewNotice icon="folder" title="ファイルを選択してください" />
      </div>
    );
  }

  return (
    <div className="filePreviewPane">
      <FilePreviewHeader file={file} />
      <RoomFilePreviewBody
        file={file}
        previewError={previewError}
        previewUrl={previewUrl}
        onPreviewLoadError={onPreviewLoadError}
      />
    </div>
  );
}

function FilePreviewHeader({ file }: { file: RoomFile }) {
  return (
    <div className="filePreviewHeader">
      <div>
        <strong>{file.original_name}</strong>
        <small>{file.content_type ?? "application/octet-stream"}</small>
      </div>
      <a href={apiUrl(file.download_url)} target="_blank" rel="noreferrer">
        <Download size={16} />
        ダウンロード
      </a>
    </div>
  );
}
