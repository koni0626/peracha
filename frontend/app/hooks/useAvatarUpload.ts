import type { Dispatch, SetStateAction } from "react";

import type { User } from "../types";
import { uploadCurrentUserAvatar } from "./appSessionApi";
import { getErrorMessage } from "./mutationRunner";

type UseAvatarUploadOptions = {
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<SetStateAction<User | null>>;
};

const MAX_AVATAR_SIZE_BYTES = 8 * 1024 * 1024;

export function useAvatarUpload({ setChatNotice, setError, setUser }: UseAvatarUploadOptions) {
  async function uploadAvatar(file: File) {
    setError(null);
    setChatNotice(null);
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setError("顔アイコン画像が大きすぎます。8MB以下の画像を選んでください。");
      return;
    }
    try {
      const updatedUser = await uploadCurrentUserAvatar(file);
      setUser(updatedUser);
      setChatNotice("顔アイコンを更新しました");
    } catch (err) {
      setError(getErrorMessage(err, "顔アイコンの更新に失敗しました"));
    }
  }

  return { uploadAvatar };
}
