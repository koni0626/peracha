import type { Message, Room, User } from "../types";

export function shouldSkipBrowserNotification(message: Message, user: User | null) {
  return message.sender_type === "user" && message.sender_name === user?.name;
}

export function browserNotificationPayload(room: Room, message: Message, isMention: boolean) {
  return {
    body: `${message.sender_name ?? "ペラチャ"}: ${message.body.slice(0, 120)}`,
    tag: `${room.id}:${message.id}`,
    title: isMention ? `${room.name} でメンションされました` : `${room.name} に新着メッセージ`,
  };
}
