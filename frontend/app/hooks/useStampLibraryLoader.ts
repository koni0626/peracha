import type { Dispatch, SetStateAction } from "react";

import type { Stamp, StampFolder } from "../types";
import { getErrorMessage } from "./mutationRunner";
import { loadStampLibrary } from "./stampApi";
import { emptyStampLibrary } from "./stampStateUtils";

type UseStampLibraryLoaderOptions = {
  clearSelectedStamps: () => void;
  setError: Dispatch<SetStateAction<string | null>>;
  setStampFolders: Dispatch<SetStateAction<StampFolder[]>>;
  setStamps: Dispatch<SetStateAction<Stamp[]>>;
  userId: string | null;
};

export function useStampLibraryLoader({
  clearSelectedStamps,
  setError,
  setStampFolders,
  setStamps,
  userId,
}: UseStampLibraryLoaderOptions) {
  async function loadStamps() {
    if (!userId) {
      const empty = emptyStampLibrary();
      setStamps(empty.stamps);
      setStampFolders(empty.folders);
      clearSelectedStamps();
      return;
    }
    setError(null);
    try {
      const library = await loadStampLibrary();
      setStamps(library.stamps);
      setStampFolders(library.folders);
    } catch (err) {
      setError(getErrorMessage(err, "スタンプ一覧の取得に失敗しました"));
    }
  }

  return {
    loadStamps,
  };
}
