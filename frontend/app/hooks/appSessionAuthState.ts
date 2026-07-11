import type { Dispatch, SetStateAction } from "react";

import type { Room, User } from "../types";

type RefLike<T> = {
  current: T;
};

type ResetSessionStateOptions = {
  activeRoomIdRef: RefLike<string | null>;
  roomsRef: RefLike<Room[]>;
  setActiveRoomId: Dispatch<SetStateAction<string | null>>;
  setHomeRoomId: Dispatch<SetStateAction<string | null>>;
  setRooms: Dispatch<SetStateAction<Room[]>>;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const AUTH_LOST_MESSAGE = "ログイン状態が切れました。再度ログインしてください。";

export function isAuthenticationError(err: unknown) {
  return err instanceof Error && err.message === "Not authenticated";
}

export function resetSessionState({
  activeRoomIdRef,
  roomsRef,
  setActiveRoomId,
  setHomeRoomId,
  setRooms,
  setUser,
}: ResetSessionStateOptions) {
  setUser(null);
  setRooms([]);
  setActiveRoomId(null);
  setHomeRoomId(null);
  roomsRef.current = [];
  activeRoomIdRef.current = null;
}
