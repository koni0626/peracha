import { PendingFilePreview } from "./PendingFilePreview";

type PendingAttachmentsProps = {
  files: File[];
  onRemove: (index: number) => void;
};

export function PendingAttachments({ files, onRemove }: PendingAttachmentsProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="pendingAttachments">
      {files.map((file, index) => (
        <PendingFilePreview
          file={file}
          key={`${file.name}-${file.size}-${index}`}
          onRemove={() => onRemove(index)}
        />
      ))}
    </div>
  );
}
