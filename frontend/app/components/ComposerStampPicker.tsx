import type { Stamp, StampFolder } from "../types";
import { StampPickerModal } from "./StampPickerModal";

type ComposerStampPickerProps = {
  open: boolean;
  selectedStampIds: string[];
  stampFolders: StampFolder[];
  stampUploading: boolean;
  stamps: Stamp[];
  onClose: () => void;
  onToggleStamp: (stampId: string) => void;
  onUploadStampImage: (file: File, folderId?: string | null) => void | Promise<void>;
};

export function ComposerStampPicker({
  open,
  selectedStampIds,
  stampFolders,
  stampUploading,
  stamps,
  onClose,
  onToggleStamp,
  onUploadStampImage
}: ComposerStampPickerProps) {
  if (!open) {
    return null;
  }

  async function uploadStampFiles(files: File[], folderId: string | null) {
    for (const file of files) {
      await onUploadStampImage(file, folderId);
    }
  }

  return (
    <StampPickerModal
      stamps={stamps}
      stampFolders={stampFolders}
      selectedStampIds={selectedStampIds}
      uploading={stampUploading}
      onClose={onClose}
      onToggleStamp={onToggleStamp}
      onUploadFiles={uploadStampFiles}
    />
  );
}
