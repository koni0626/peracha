import type { MessageDraftActionOptions } from "./messageDraftActionTypes";
import { getErrorMessage } from "./mutationRunner";
import { usePeraichiDraftSender } from "./usePeraichiDraftSender";
import { useDraftTextAssistance } from "./useDraftTextAssistance";
import { useLatestAsyncFlag } from "./useLatestAsyncFlag";

export function useMessageDraftActions({
  activeRoomId,
  latestDraftRef,
  postMessage,
  sending,
  setDraft,
  setError,
}: MessageDraftActionOptions) {
  const proofreadRequest = useLatestAsyncFlag();
  const clarifyRequest = useLatestAsyncFlag();
  const { clarifyDraftText, rewriteDraftText } = useDraftTextAssistance({ activeRoomId, latestDraftRef, setDraft });
  const { creatingPeraichi, sendPeraichiMessage } = usePeraichiDraftSender({
    activeRoomId,
    clarifying: clarifyRequest.active,
    latestDraftRef,
    postMessage,
    rewriteDraftText,
    sending,
    setError,
  });

  async function improveDraft() {
    if (!activeRoomId || !latestDraftRef.current.trim() || proofreadRequest.active || clarifyRequest.active) {
      return;
    }
    const requestId = proofreadRequest.begin();
    setError(null);
    try {
      await rewriteDraftText();
    } catch (err) {
      setError(getErrorMessage(err, "誤字・脱字チェックに失敗しました"));
    } finally {
      proofreadRequest.finish(requestId);
    }
  }

  async function clarifyDraft() {
    if (!activeRoomId || !latestDraftRef.current.trim() || clarifyRequest.active || sending || creatingPeraichi) {
      return;
    }
    const requestId = clarifyRequest.begin();
    setError(null);
    try {
      await clarifyDraftText();
    } catch (err) {
      setError(getErrorMessage(err, "わかりやすい整形に失敗しました"));
    } finally {
      clarifyRequest.finish(requestId);
    }
  }

  return {
    clarifying: clarifyRequest.active,
    creatingPeraichi,
    proofreading: proofreadRequest.active,
    clarifyDraft,
    improveDraft,
    sendPeraichiMessage,
  };
}
