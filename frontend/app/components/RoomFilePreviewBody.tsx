import type { RoomFile } from "../types";
import { OfficeDocumentPreview } from "./OfficeDocumentPreview";
import { RoomFileImagePreview } from "./RoomFileImagePreview";
import { RoomFilePreviewNotice } from "./RoomFilePreviewNotice";
import { isOfficePreviewKind } from "./roomFilePreviewKinds";

type RoomFilePreviewBodyProps = {
  file: RoomFile;
  previewError: string | null;
  previewUrl: string | null;
  onPreviewLoadError: (message: string) => void;
};

export function RoomFilePreviewBody({
  file,
  previewError,
  previewUrl,
  onPreviewLoadError,
}: RoomFilePreviewBodyProps) {
  if (file.preview_kind === "pdf") {
    return previewUrl ? (
      <iframe src={previewUrl} title={file.original_name} />
    ) : (
      <RoomFilePreviewNotice title={previewError ?? "PDFプレビューを読み込み中です。"} />
    );
  }
  if (file.preview_kind === "image") {
    return (
      <RoomFileImagePreview
        file={file}
        previewError={previewError}
        previewUrl={previewUrl}
        onPreviewLoadError={onPreviewLoadError}
      />
    );
  }
  if (file.preview_kind === "video") {
    return previewUrl ? (
      <video className="fileVideoPreview" src={previewUrl} controls preload="metadata" />
    ) : (
      <RoomFilePreviewNotice title="動画プレビューを読み込み中です。" />
    );
  }
  if (isOfficePreviewKind(file.preview_kind)) {
    return previewError ? (
      <RoomFilePreviewNotice title={previewError} body="ダウンロードして確認してください。" />
    ) : (
      <OfficeDocumentPreview
        kind={file.preview_kind}
        title={file.original_name}
        url={previewUrl}
        onError={onPreviewLoadError}
      />
    );
  }
  return <RoomFilePreviewNotice title="プレビュー対象外です。" body="ダウンロードして確認してください。" />;
}
