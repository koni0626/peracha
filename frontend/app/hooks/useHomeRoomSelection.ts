import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Room } from "../types";

type UseHomeRoomSelectionOptions = {
  homeRoomId: string | null;
  rooms: Room[];
  setHomeRoomId: Dispatch<SetStateAction<string | null>>;
};

export function useHomeRoomSelection({ homeRoomId, rooms, setHomeRoomId }: UseHomeRoomSelectionOptions) {
  useEffect(() => {
    if (rooms.length === 0) {
      setHomeRoomId(null);
      return;
    }
    if (!homeRoomId || !rooms.some((room) => room.id === homeRoomId)) {
      setHomeRoomId(rooms[0].id);
    }
  }, [homeRoomId, rooms, setHomeRoomId]);
}
