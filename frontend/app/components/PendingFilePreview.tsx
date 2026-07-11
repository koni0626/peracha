import { Video, X } from "lucide-react";

import { isImageFile, isVideoFile, usePendingAttachmentPreviewUrl } from "./pendingAttachmentPreview";

type PendingFilePreviewProps = {
  file: File;
  onRemove: () => void;
};

function PendingRemoveButton({ onRemove }: { onRemove: () => void }) {
  return (
    <button type="button" title="添付を削除" onClick={onRemove}>
      <X size={13} />
    </button>
  );
}

export function PendingFilePreview({ file, onRemove }: PendingFilePreviewProps) {
  const isImage = isImageFile(file);
  const isVideo = isVideoFile(file);
  const previewUrl = usePendingAttachmentPreviewUrl(file, isImage || isVideo);

  if (previewUrl && isImage) {
    return (
      <span className="pendingImageAttachment">
        <img src={previewUrl} alt={file.name} />
        <span>{file.name}</span>
        <PendingRemoveButton onRemove={onRemove} />
      </span>
    );
  }

  if (previewUrl && isVideo) {
    return (
      <span className="pendingVideoAttachment">
        <video src={previewUrl} controls preload="metadata" />
        <span>{file.name}</span>
        <PendingRemoveButton onRemove={onRemove} />
      </span>
    );
  }

  return (
    <span>
      {isVideo ? <Video size={14} /> : null}
      {file.name}
      <PendingRemoveButton onRemove={onRemove} />
    </span>
  );
}
