"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Message, RoomFile, Stamp } from "../types";
import { resolveComposerAction } from "./messageComposerState";
import { useLatestValueRef } from "./useLatestValueRef";
import { useMessageDraftActions } from "./useMessageDraftActions";
import { useMessagePosting } from "./useMessagePosting";
import { useMessageSendAction } from "./useMessageSendAction";

type UseMessageComposerOptions = {
  activeRoomId: string | null;
  clearSelectedStamps: () => void;
  clearReplyTo: () => void;
  draft: string;
  replyToMessageId: string | null;
  selectedStampIds: string[];
  setDraft: Dispatch<SetStateAction<string>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
  stamps: Stamp[];
  uploadRoomFile: (file: File, roomId?: string | null) => Promise<RoomFile>;
  loadRoomFiles: (roomId?: string | null) => Promise<void>;
};

export function useMessageComposer({
  activeRoomId,
  clearSelectedStamps,
  clearReplyTo,
  draft,
  replyToMessageId,
  selectedStampIds,
  setDraft,
  setMessages,
  setError,
  stamps,
  uploadRoomFile,
  loadRoomFiles
}: UseMessageComposerOptions) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const latestDraftRef = useLatestValueRef(draft);
  const { postMessage, uploadInlineFile } = useMessagePosting({
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
  });

  const draftActions = useMessageDraftActions({
    activeRoomId,
    latestDraftRef,
    postMessage,
    sending,
    setDraft,
    setError,
  });
  const composerAction = resolveComposerAction({
    clarifying: draftActions.clarifying,
    creatingPeraichi: draftActions.creatingPeraichi,
    proofreading: draftActions.proofreading,
    sending,
  });
  const { sendMessage } = useMessageSendAction({
    activeRoomId,
    clarifying: draftActions.clarifying,
    creatingPeraichi: draftActions.creatingPeraichi,
    latestDraftRef,
    pendingFileCount: pendingFiles.length,
    postMessage,
    selectedStampCount: selectedStampIds.length,
    sending,
    setError,
    setSending,
  });

  return {
    draft,
    setDraft,
    pendingFiles,
    setPendingFiles,
    composerAction,
    clarifyDraft: draftActions.clarifyDraft,
    improveDraft: draftActions.improveDraft,
    sendPeraichiMessage: draftActions.sendPeraichiMessage,
    sendMessage,
    uploadInlineFile
  };
}
