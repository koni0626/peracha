import { useEffect } from "react";

import type { Message, RoomFile } from "../types";
import { uploadInlineFileAttachment } from "./messageComposerUploads";
import { useChatThreadDraftState } from "./useChatThreadDraftState";
import { useChatThreadMessages } from "./useChatThreadMessages";
import { useChatThreadSender } from "./useChatThreadSender";
import { useThreadPanelResize } from "./useThreadPanelResize";

type UseChatThreadOptions = {
  activeRoomId: string | null;
  loadRoomFiles: (roomId?: string | null) => Promise<void>;
  timelineMessages: Message[];
  uploadRoomFile: (file: File, roomId?: string | null) => Promise<RoomFile>;
};

export function useChatThread({ activeRoomId, loadRoomFiles, timelineMessages, uploadRoomFile }: UseChatThreadOptions) {
  const draftState = useChatThreadDraftState();
  const threadMessages = useChatThreadMessages({ activeRoomId, timelineMessages });
  const { startResize, width } = useThreadPanelResize();
  const { send, sending } = useChatThreadSender({
    activeRoomId,
    draft: draftState.draft,
    loadRoomFiles,
    pendingFiles: draftState.pendingFiles,
    root: threadMessages.root,
    selectedStampIds: draftState.selectedStampIds,
    setDraft: draftState.setDraft,
    setMessages: threadMessages.setMessages,
    setPendingFiles: draftState.setPendingFiles,
    setRoot: threadMessages.setRoot,
    setSelectedStampIds: draftState.setSelectedStampIds,
    uploadRoomFile,
  });

  useEffect(() => {
    draftState.resetDraftState();
  }, [activeRoomId]);

  async function uploadInlineFile(file: File) {
    return uploadInlineFileAttachment(file, activeRoomId, uploadRoomFile, loadRoomFiles);
  }

  return {
    root: threadMessages.root,
    messages: threadMessages.messages,
    draft: draftState.draft,
    pendingFiles: draftState.pendingFiles,
    selectedStampIds: draftState.selectedStampIds,
    loading: threadMessages.loading,
    sending,
    width,
    close: threadMessages.close,
    open: threadMessages.open,
    send,
    setDraft: draftState.setDraft,
    setPendingFiles: draftState.setPendingFiles,
    setSelectedStampIds: draftState.setSelectedStampIds,
    startResize,
    toggleStamp: draftState.toggleStamp,
    uploadInlineFile,
  };
}
