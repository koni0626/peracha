import type { Message } from "./chatTypes";
import type { Room, User } from "./userRoomTypes";

export type Page<T> = {
  items: T[];
  next_cursor: string | null;
};

export type MeResponse = {
  user: User;
  rooms: Room[];
};

export type WsEvent = {
  event: string;
  room_id: string;
  data: Message | Record<string, unknown>;
};
