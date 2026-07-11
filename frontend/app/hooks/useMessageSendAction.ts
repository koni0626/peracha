import type { FormEvent } from "react";

import { canSendMessage } from "./messageComposerGuards";
import { runSavingMutation } from "./mutationRunner";

type UseMessageSendActionOptions = {
  activeRoomId: string | null;
  clarifying: boolean;
  creatingPeraichi: boolean;
  latestDraftRef: { current: string };
  pendingFileCount: number;
  postMessage: (body: string) => Promise<unknown>;
  selectedStampCount: number;
  sending: boolean;
  setError: (message: string | null) => void;
  setSending: (sending: boolean) => void;
};

export function useMessageSendAction({
  activeRoomId,
  clarifying,
  creatingPeraichi,
  latestDraftRef,
  pendingFileCount,
  postMessage,
  selectedStampCount,
  sending,
  setError,
  setSending,
}: UseMessageSendActionOptions) {
  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentDraft = latestDraftRef.current;
    if (!canSendMessage({
      activeRoomId,
      clarifying,
      creatingPeraichi,
      draft: currentDraft,
      pendingFileCount,
      selectedStampCount,
      sending,
    })) {
      return;
    }
    await runSavingMutation({ fallbackError: "メッセージ送信に失敗しました", setError, setSaving: setSending }, async () => {
      await postMessage(currentDraft);
    });
  }

  return { sendMessage };
}
