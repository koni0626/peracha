"use client";

import { apiFetch } from "../api";
import type { Message, Task } from "../types";
import { roomMessagesPath } from "./realtimeMessageUtils";

export async function fetchRoomMessages(roomId: string, since?: string | null, threadId?: string | null) {
  return apiFetch<{ items: Message[] }>(roomMessagesPath(roomId, since, threadId));
}

export async function fetchRoomThreadMessages(roomId: string, threadId: string) {
  return fetchRoomMessages(roomId, null, threadId);
}

export async function markRoomReadState(roomId: string, messageId: string) {
  return apiFetch<{ items: Message[] }>(`/api/rooms/${roomId}/read-state`, {
    method: "POST",
    body: JSON.stringify({ message_id: messageId })
  });
}

export async function fetchRoomTasks(roomId: string) {
  return apiFetch<{ items: Task[] }>(`/api/tasks?room_id=${roomId}`);
}
