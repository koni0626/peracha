import type { RoomFile } from "../types";
import { RoomFilePreviewNotice } from "./RoomFilePreviewNotice";

type RoomFileImagePreviewProps = {
  file: RoomFile;
  previewError: string | null;
  previewUrl: string | null;
  onPreviewLoadError: (message: string) => void;
};

export function RoomFileImagePreview({
  file,
  previewError,
  previewUrl,
  onPreviewLoadError,
}: RoomFileImagePreviewProps) {
  if (previewError) {
    return <RoomFilePreviewNotice title={previewError} body="ダウンロードして確認してください。" />;
  }
  if (previewUrl) {
    return (
      <img
        src={previewUrl}
        alt={file.original_name}
        onError={() => onPreviewLoadError("画像のプレビューを読み込めませんでした。")}
      />
    );
  }
  return <RoomFilePreviewNotice title="画像プレビューを読み込み中です。" />;
}
