import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import type { Attachment, Message, RoomFile } from "../types";
import { appendUniqueById } from "./idListUtils";
import { postRoomMessage } from "./messageComposerApi";
import { createMessagePostPayload, hasMessagePostPayload } from "./messageComposerPostPayload";
import { uploadFilesAsAttachments, uploadInlineFileAttachment } from "./messageComposerUploads";

type UseMessagePostingOptions = {
  activeRoomId: string | null;
  clearReplyTo: () => void;
  clearSelectedStamps: () => void;
  latestDraftRef: MutableRefObject<string>;
  loadRoomFiles: (roomId?: string | null) => Promise<void>;
  pendingFiles: File[];
  replyToMessageId: string | null;
  setDraft: Dispatch<SetStateAction<string>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setPendingFiles: Dispatch<SetStateAction<File[]>>;
  uploadRoomFile: (file: File, roomId?: string | null) => Promise<RoomFile>;
};

export function useMessagePosting({
  activeRoomId,
  clearReplyTo,
  clearSelectedStamps,
  latestDraftRef,
  loadRoomFiles,
  pendingFiles,
  replyToMessageId,
  setDraft,
  setMessages,
  setPendingFiles,
  uploadRoomFile,
}: UseMessagePostingOptions) {
  async function uploadPendingFileAttachments() {
    if (!activeRoomId) {
      return [];
    }
    return uploadFilesAsAttachments(pendingFiles, activeRoomId, uploadRoomFile);
  }

  async function uploadInlineFile(file: File) {
    return uploadInlineFileAttachment(file, activeRoomId, uploadRoomFile, loadRoomFiles);
  }

  async function postMessage(body: string, extraAttachments: Attachment[] = []) {
    if (!activeRoomId) {
      return null;
    }
    const fileAttachments = await uploadPendingFileAttachments();
    const attachments = [...fileAttachments, ...extraAttachments];
    const payload = createMessagePostPayload({ attachments, body, replyToMessageId: replyToMessageId });
    if (!hasMessagePostPayload(payload)) {
      return null;
    }

    const message = await postRoomMessage(activeRoomId, payload);
    setMessages((current) => appendUniqueById(current, message));
    latestDraftRef.current = "";
    setDraft("");
    setPendingFiles([]);
    clearSelectedStamps();
    clearReplyTo();
    await loadRoomFiles(activeRoomId);
    return message;
  }

  return {
    postMessage,
    uploadInlineFile,
  };
}
