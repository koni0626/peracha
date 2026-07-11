import type { Message, User } from "../types";

export function messageMentionsUser(message: Message, user: User | null) {
  if (!user) {
    return false;
  }
  const metadata = message.metadata;
  if (metadata?.mention_all) {
    return true;
  }
  if (metadata?.mentions?.some((mention) => mention.id === user.id || mention.email === user.email)) {
    return true;
  }
  const lowered = message.body.toLowerCase();
  return [user.name, user.email, user.email.split("@", 1)[0]]
    .filter(Boolean)
    .some((alias) => lowered.includes(`@${alias.toLowerCase()}`));
}

export function sortMessagesByCreatedAt(messages: Message[]) {
  return [...messages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function mergeMessageLists(current: Message[], incoming: Message[]) {
  const known = new Set(current.map((item) => item.id));
  return sortMessagesByCreatedAt([...current, ...incoming.filter((item) => !known.has(item.id))]);
}

export function applyMessageStatusUpdates(current: Message[], incoming: Message[]) {
  const incomingById = new Map(incoming.map((item) => [item.id, item]));
  const merged = current.map((item) => incomingById.get(item.id) ?? item);
  for (const item of incoming) {
    if (!current.some((message) => message.id === item.id)) {
      merged.push(item);
    }
  }
  return sortMessagesByCreatedAt(merged);
}

export function roomMessagesPath(roomId: string, since?: string | null, threadId?: string | null) {
  const params = new URLSearchParams();
  if (since) {
    params.set("since", since);
  }
  if (threadId) {
    params.set("thread_id", threadId);
  }
  const query = params.toString();
  return `/api/rooms/${roomId}/messages${query ? `?${query}` : ""}`;
}
