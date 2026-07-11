import type { Dispatch, SetStateAction } from "react";

import type { AppSession, ComposerState, RealtimeChat, RoomFiles, StampManager } from "./perachaAppTypes";
import { useMessageComposer } from "./useMessageComposer";

type UsePerachaMessageComposerOptions = {
  composerState: ComposerState;
  files: RoomFiles;
  realtime: RealtimeChat;
  session: AppSession;
  setError: Dispatch<SetStateAction<string | null>>;
  stamps: StampManager;
};

export function usePerachaMessageComposer({
  composerState,
  files,
  realtime,
  session,
  setError,
  stamps,
}: UsePerachaMessageComposerOptions) {
  return useMessageComposer({
    activeRoomId: session.activeRoomId,
    clearSelectedStamps: stamps.clearSelectedStamps,
    clearReplyTo: () => composerState.setReplyTo(null),
    draft: composerState.draft,
    replyToMessageId: composerState.replyTo?.id ?? null,
    selectedStampIds: stamps.selectedStampIds,
    setDraft: composerState.setDraft,
    setMessages: realtime.setMessages,
    setError,
    stamps: stamps.stamps,
    uploadRoomFile: files.uploadRoomFile,
    loadRoomFiles: files.loadRoomFiles,
  });
}
