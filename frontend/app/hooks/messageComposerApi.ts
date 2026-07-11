"use client";

import { apiFetch } from "../api";
import type { Attachment, Message, MessageRewriteResult, PeraichiImageResult, StampUse } from "../types";

type PostMessageInput = {
  body: string;
  attachments: Attachment[];
  reply_to_message_id?: string | null;
  stamps: StampUse[];
  thread_id?: string | null;
};

export function postRoomMessage(roomId: string, input: PostMessageInput) {
  return apiFetch<Message>(`/api/rooms/${roomId}/messages`, {
    method: "POST",
    headers: { "Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify({
      body: input.body,
      attachments: input.attachments,
      reply_to_message_id: input.reply_to_message_id ?? null,
      stamps: input.stamps,
      thread_id: input.thread_id ?? null,
      diagnose_after_post: false
    })
  });
}

export function rewriteRoomDraft(roomId: string, text: string) {
  return apiFetch<MessageRewriteResult>(`/api/rooms/${roomId}/assist/rewrite`, {
    method: "POST",
    body: JSON.stringify({ text })
  });
}

export function clarifyRoomDraft(roomId: string, text: string) {
  return apiFetch<MessageRewriteResult>(`/api/rooms/${roomId}/assist/clarify`, {
    method: "POST",
    body: JSON.stringify({ text })
  });
}

export function createRoomPeraichiImage(roomId: string, text: string) {
  return apiFetch<PeraichiImageResult>(`/api/rooms/${roomId}/assist/peraichi`, {
    method: "POST",
    body: JSON.stringify({ text })
  });
}
