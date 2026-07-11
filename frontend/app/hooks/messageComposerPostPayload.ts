import type { Attachment, StampUse } from "../types";
import { buildMessageBody } from "./messageComposerPayload";

export type MessagePostPayload = {
  attachments: Attachment[];
  body: string;
  reply_to_message_id?: string | null;
  stamps: StampUse[];
  thread_id?: string | null;
};

export function createMessagePostPayload({
  attachments,
  body,
  replyToMessageId,
  stamps = [],
  threadId,
}: {
  attachments: Attachment[];
  body: string;
  replyToMessageId?: string | null;
  stamps?: StampUse[];
  threadId?: string | null;
}): MessagePostPayload {
  return {
    attachments,
    body: buildMessageBody(body, attachments, stamps),
    reply_to_message_id: replyToMessageId,
    stamps,
    thread_id: threadId,
  };
}

export function hasMessagePostPayload(payload: MessagePostPayload) {
  return Boolean(payload.body.trim() || payload.attachments.length > 0 || payload.stamps.length > 0);
}
