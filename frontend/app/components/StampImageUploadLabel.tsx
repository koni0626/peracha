import { ImagePlus } from "lucide-react";

import { imageFiles } from "./stampExplorerTypes";

type StampImageUploadLabelProps = {
  folderId: string | null;
  label?: string;
  onUploadFiles: (files: File[], folderId: string | null) => void | Promise<void>;
};

export function StampImageUploadLabel({ folderId, label = "画像を追加", onUploadFiles }: StampImageUploadLabelProps) {
  return (
    <label>
      <ImagePlus size={15} />
      {label}
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        onChange={async (event) => {
          const input = event.currentTarget;
          const files = imageFiles(Array.from(event.target.files ?? []));
          if (files.length > 0) {
            await onUploadFiles(files, folderId);
          }
          input.value = "";
        }}
      />
    </label>
  );
}
