import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { MeResponse, Room, User } from "../types";
import { resetSessionState as resetSessionStateData } from "./appSessionAuthState";
import { findAddedRooms, resolveNextActiveRoomId } from "./appSessionRoomState";
import { useHomeRoomSelection } from "./useHomeRoomSelection";

type UseAppSessionStateOptions = {
  setChatNotice: Dispatch<SetStateAction<string | null>>;
};

export function useAppSessionState({ setChatNotice }: UseAppSessionStateOptions) {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [homeRoomId, setHomeRoomId] = useState<string | null>(null);
  const roomsRef = useRef<Room[]>([]);
  const activeRoomIdRef = useRef<string | null>(null);

  function applySession(data: MeResponse, selectFirst = false) {
    const currentRooms = roomsRef.current;
    const addedRooms = findAddedRooms(currentRooms, data.rooms);
    const currentActiveRoomId = activeRoomIdRef.current;

    setUser(data.user);
    setRooms(data.rooms);
    if (addedRooms.length > 0 && currentRooms.length > 0) {
      setChatNotice(`新しいルームに追加されました: ${addedRooms.map((room) => room.name).join(", ")}`);
    }
    setActiveRoomId(
      resolveNextActiveRoomId({
        addedRooms,
        currentActiveRoomId,
        nextRooms: data.rooms,
        previousRooms: currentRooms,
        selectFirst,
      })
    );
  }

  function resetSessionState() {
    resetSessionStateData({
      activeRoomIdRef,
      roomsRef,
      setActiveRoomId,
      setHomeRoomId,
      setRooms,
      setUser,
    });
  }

  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);

  useHomeRoomSelection({ homeRoomId, rooms, setHomeRoomId });

  return {
    activeRoomId,
    activeRoomIdRef,
    applySession,
    homeRoomId,
    resetSessionState,
    rooms,
    roomsRef,
    setActiveRoomId,
    setHomeRoomId,
    setRooms,
    setUser,
    user,
  };
}
