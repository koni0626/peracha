import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { StampFolder } from "../types";
import { getErrorMessage, runSavingMutation } from "./mutationRunner";
import { createStampFolder } from "./stampApi";
import { upsertStampFolder } from "./stampStateUtils";

type UseStampFolderCreationOptions = {
  setError: Dispatch<SetStateAction<string | null>>;
  setSelectedUploadFolderId: Dispatch<SetStateAction<string | null>>;
  setStampFolders: Dispatch<SetStateAction<StampFolder[]>>;
};

export function useStampFolderCreation({
  setError,
  setSelectedUploadFolderId,
  setStampFolders,
}: UseStampFolderCreationOptions) {
  const [newStampFolderName, setNewStampFolderName] = useState("");
  const [stampFolderCreating, setStampFolderCreating] = useState(false);

  async function addStampFolder() {
    const name = newStampFolderName.trim();
    await createFolderByName(name);
  }

  async function createFolderByName(name: string) {
    if (!name) {
      setError("スタンプフォルダ名を入力してください");
      return;
    }
    await runSavingMutation(
      {
        fallbackError: "スタンプフォルダの作成に失敗しました",
        formatError: formatStampFolderError,
        setError,
        setSaving: setStampFolderCreating,
      },
      async () => {
        const folder = await createStampFolder(name);
        setStampFolders((current) => upsertStampFolder(current, folder));
        setSelectedUploadFolderId(folder.id);
        setNewStampFolderName("");
      }
    );
  }

  return {
    addStampFolder,
    createFolderByName,
    newStampFolderName,
    setNewStampFolderName,
    stampFolderCreating,
  };
}

function formatStampFolderError(err: unknown, fallbackError: string) {
  const message = getErrorMessage(err, fallbackError);
  return message.includes("Method Not Allowed") ? "スタンプフォルダAPIが未反映です。バックエンドを再起動してください。" : message;
}
