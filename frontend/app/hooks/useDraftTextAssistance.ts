import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import { clarifyRoomDraft, rewriteRoomDraft } from "./messageComposerApi";

type UseDraftTextAssistanceOptions = {
  activeRoomId: string | null;
  latestDraftRef: MutableRefObject<string>;
  setDraft: Dispatch<SetStateAction<string>>;
};

export function useDraftTextAssistance({
  activeRoomId,
  latestDraftRef,
  setDraft,
}: UseDraftTextAssistanceOptions) {
  async function rewriteDraftText(applyToDraft = true) {
    const sourceText = latestDraftRef.current;
    if (!activeRoomId || !sourceText.trim()) {
      return null;
    }
    const result = await rewriteRoomDraft(activeRoomId, sourceText);
    if (applyToDraft && latestDraftRef.current === sourceText) {
      latestDraftRef.current = result.improved_text;
      setDraft(result.improved_text);
    }
    return result.improved_text;
  }

  async function clarifyDraftText() {
    const sourceText = latestDraftRef.current;
    if (!activeRoomId || !sourceText.trim()) {
      return null;
    }
    const result = await clarifyRoomDraft(activeRoomId, sourceText);
    if (latestDraftRef.current === sourceText) {
      latestDraftRef.current = result.improved_text;
      setDraft(result.improved_text);
    }
    return result.improved_text;
  }

  return {
    clarifyDraftText,
    rewriteDraftText,
  };
}
