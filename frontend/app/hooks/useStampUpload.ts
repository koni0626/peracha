import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Stamp, StampFolder } from "../types";
import { runSavingMutation } from "./mutationRunner";
import { uploadStampFile } from "./stampApi";
import { adjustFolderStampCount, upsertStamp } from "./stampStateUtils";

type UseStampUploadOptions = {
  selectedUploadFolderId: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setStampFolders: Dispatch<SetStateAction<StampFolder[]>>;
  setStamps: Dispatch<SetStateAction<Stamp[]>>;
};

export function useStampUpload({
  selectedUploadFolderId,
  setError,
  setStampFolders,
  setStamps,
}: UseStampUploadOptions) {
  const [stampUploading, setStampUploading] = useState(false);

  async function uploadStampImage(file: File, folderId: string | null = selectedUploadFolderId) {
    if (!file.type.startsWith("image/")) {
      setError("スタンプ画像には画像ファイルを指定してください");
      return;
    }
    await runSavingMutation(
      { fallbackError: "スタンプ画像のアップロードに失敗しました", setError, setSaving: setStampUploading },
      async () => {
        const stamp = await uploadStampFile(file, folderId);
        setStamps((current) => upsertStamp(current, stamp));
        setStampFolders((current) => adjustFolderStampCount(current, stamp.folder_id, 1));
      }
    );
  }

  return {
    stampUploading,
    uploadStampImage,
  };
}
