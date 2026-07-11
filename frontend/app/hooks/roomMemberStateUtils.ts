import type { RoomMember, User } from "../types";
import { appendUniqueById, removeById, replaceById } from "./idListUtils";

export function addUniqueRoomMember(current: RoomMember[], member: RoomMember) {
  return appendUniqueById(current, member);
}

export function replaceRoomMember(current: RoomMember[], member: RoomMember) {
  return replaceById(current, member);
}

export function removeRoomMemberById(current: RoomMember[], memberId: string) {
  return removeById(current, memberId);
}

export function removeUserSearchCandidate(current: User[], userId: string) {
  return removeById(current, userId);
}
