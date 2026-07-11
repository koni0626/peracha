import type { Dispatch, RefObject, SetStateAction } from "react";

import type { Message, Task } from "../types";
import { fetchRoomMessages, fetchRoomTasks, markRoomReadState } from "./realtimeChatApi";
import { reportRealtimeError } from "./realtimeErrorUtils";
import { applyMessageStatusUpdates, mergeMessageLists } from "./realtimeMessageUtils";

type CreateRealtimeRoomSyncOptions = {
  activeRoomId: string;
  lastMessageAtRef: RefObject<string | null>;
  roomMessageCursorRef: RefObject<Record<string, string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setTasks: Dispatch<SetStateAction<Task[]>>;
};

export function createRealtimeRoomSync({
  activeRoomId,
  lastMessageAtRef,
  roomMessageCursorRef,
  setError,
  setMessages,
  setTasks,
}: CreateRealtimeRoomSyncOptions) {
  function mergeMessages(items: Message[]) {
    if (items.length > 0) {
      lastMessageAtRef.current = items[items.length - 1].created_at;
    }
    setMessages((current) => mergeMessageLists(current, items));
  }

  function refreshMessageStatuses(items: Message[]) {
    setMessages((current) => applyMessageStatusUpdates(current, items));
  }

  async function markRoomRead(messageId?: string | null) {
    if (!messageId) {
      return;
    }
    const data = await markRoomReadState(activeRoomId, messageId);
    refreshMessageStatuses(data.items);
  }

  async function fetchMessages(since?: string | null, markRead = true) {
    const data = await fetchRoomMessages(activeRoomId, since);
    if (since) {
      mergeMessages(data.items);
    } else {
      setMessages(data.items);
      lastMessageAtRef.current = data.items[data.items.length - 1]?.created_at ?? null;
    }
    roomMessageCursorRef.current[activeRoomId] = data.items[data.items.length - 1]?.created_at ?? lastMessageAtRef.current;
    const lastMessageId = data.items[data.items.length - 1]?.id;
    if (markRead) {
      markRoomRead(lastMessageId).catch(reportRealtimeError(setError, "既読状態の更新に失敗しました"));
    }
  }

  async function fetchTasks() {
    const data = await fetchRoomTasks(activeRoomId);
    setTasks(data.items);
  }

  return {
    fetchMessages,
    fetchTasks,
    markRoomRead,
    mergeMessages,
  };
}
