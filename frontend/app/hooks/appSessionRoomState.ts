import type { Room } from "../types";
import { appendUniqueById, pickCurrentOrFirstId, removeById, replaceById } from "./idListUtils";

type ResolveNextActiveRoomIdOptions = {
  addedRooms: Room[];
  currentActiveRoomId: string | null;
  nextRooms: Room[];
  previousRooms: Room[];
  selectFirst: boolean;
};

export function findAddedRooms(previousRooms: Room[], nextRooms: Room[]) {
  const previousRoomIds = new Set(previousRooms.map((room) => room.id));
  return nextRooms.filter((room) => !previousRoomIds.has(room.id));
}

export function appendUniqueRoom(rooms: Room[], room: Room) {
  return appendUniqueById(rooms, room);
}

export function replaceRoom(rooms: Room[], room: Room) {
  return replaceById(rooms, room);
}

export function removeRoomById(rooms: Room[], roomId: string) {
  return removeById(rooms, roomId);
}

export function resolveNextActiveRoomId({
  addedRooms,
  currentActiveRoomId,
  nextRooms,
  previousRooms,
  selectFirst,
}: ResolveNextActiveRoomIdOptions) {
  if (addedRooms.length > 0 && previousRooms.length === 0) {
    return addedRooms[0].id;
  }
  if (selectFirst) {
    return nextRooms[0]?.id ?? null;
  }
  if (currentActiveRoomId === null) {
    return null;
  }
  return pickCurrentOrFirstId(nextRooms, currentActiveRoomId);
}
