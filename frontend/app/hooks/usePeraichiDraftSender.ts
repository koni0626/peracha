import { useState } from "react";

import { createRoomPeraichiImage } from "./messageComposerApi";
import { peraichiImageToAttachment } from "./messageComposerPayload";
import type { MessageDraftActionOptions } from "./messageDraftActionTypes";
import { getErrorMessage } from "./mutationRunner";

type UsePeraichiDraftSenderOptions = Pick<
  MessageDraftActionOptions,
  "activeRoomId" | "latestDraftRef" | "postMessage" | "sending" | "setError"
> & {
  clarifying: boolean;
  rewriteDraftText: () => Promise<string | null | undefined>;
};

export function usePeraichiDraftSender({
  activeRoomId,
  clarifying,
  latestDraftRef,
  postMessage,
  rewriteDraftText,
  sending,
  setError,
}: UsePeraichiDraftSenderOptions) {
  const [creatingPeraichi, setCreatingPeraichi] = useState(false);

  async function sendPeraichiMessage() {
    if (!activeRoomId || !latestDraftRef.current.trim() || creatingPeraichi || sending || clarifying) {
      return;
    }
    setError(null);
    setCreatingPeraichi(true);
    try {
      const improvedText = (await rewriteDraftText()) ?? latestDraftRef.current.trim();
      const image = await createRoomPeraichiImage(activeRoomId, improvedText);
      await postMessage(improvedText, [peraichiImageToAttachment(image)]);
    } catch (err) {
      setError(getErrorMessage(err, "ペライチ送信に失敗しました"));
    } finally {
      setCreatingPeraichi(false);
    }
  }

  return {
    creatingPeraichi,
    sendPeraichiMessage,
  };
}
