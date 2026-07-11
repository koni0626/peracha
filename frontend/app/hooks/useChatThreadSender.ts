import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Message, RoomFile } from "../types";
import { appendUniqueById } from "./idListUtils";
import { hasMessagePayload } from "./messageComposerGuards";
import { postRoomMessage } from "./messageComposerApi";
import { createMessagePostPayload } from "./messageComposerPostPayload";
import { uploadFilesAsAttachments } from "./messageComposerUploads";

type UseChatThreadSenderOptions = {
  activeRoomId: string | null;
  draft: string;
  loadRoomFiles: (roomId?: string | null) => Promise<void>;
  pendingFiles: File[];
  root: Message | null;
  selectedStampIds: string[];
  setDraft: Dispatch<SetStateAction<string>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setPendingFiles: Dispatch<SetStateAction<File[]>>;
  setRoot: Dispatch<SetStateAction<Message | null>>;
  setSelectedStampIds: Dispatch<SetStateAction<string[]>>;
  uploadRoomFile: (file: File, roomId?: string | null) => Promise<RoomFile>;
};

export function useChatThreadSender({
  activeRoomId,
  draft,
  loadRoomFiles,
  pendingFiles,
  root,
  selectedStampIds,
  setDraft,
  setMessages,
  setPendingFiles,
  setRoot,
  setSelectedStampIds,
  uploadRoomFile,
}: UseChatThreadSenderOptions) {
  const [sending, setSending] = useState(false);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeRoomId || !root || sending || !hasMessagePayload(draft, pendingFiles.length, selectedStampIds.length)) {
      return;
    }
    setSending(true);
    try {
      const uploadedAttachments = await uploadFilesAsAttachments(pendingFiles, activeRoomId, uploadRoomFile);
      const payload = createMessagePostPayload({
        attachments: uploadedAttachments,
        body: draft,
        replyToMessageId: root.id,
        threadId: root.id,
      });
      const message = await postRoomMessage(activeRoomId, payload);
      setMessages((current) => appendUniqueById(current, message));
      setRoot((current) => (current ? { ...current, thread_reply_count: current.thread_reply_count + 1 } : current));
      setDraft("");
      setPendingFiles([]);
      setSelectedStampIds([]);
      await loadRoomFiles(activeRoomId);
    } finally {
      setSending(false);
    }
  }

  return {
    send,
    sending,
  };
}
