import type { Message, User } from "../types";
import { messageMentionsUser } from "./realtimeMessageUtils";

export type InactiveRoomMessageSummary = {
  hasMention: boolean;
  incoming: Message[];
  lastIncoming: Message | null;
  lastIncomingMentioned: boolean;
};

export function summarizeInactiveRoomMessages(messages: Message[], user: User): InactiveRoomMessageSummary {
  const incoming = messages.filter((message) => message.sender_name !== user.name);
  const lastIncoming = incoming[incoming.length - 1] ?? null;
  return {
    hasMention: incoming.some((message) => messageMentionsUser(message, user)),
    incoming,
    lastIncoming,
    lastIncomingMentioned: lastIncoming ? messageMentionsUser(lastIncoming, user) : false,
  };
}
