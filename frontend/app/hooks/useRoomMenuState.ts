"use client";

import { useEffect, useMemo, useState } from "react";
import type { Room, RoomContextMenu } from "../types";

type UseRoomMenuStateOptions = {
  activeRoomId: string | null;
  rooms: Room[];
};

export function useRoomMenuState({ activeRoomId, rooms }: UseRoomMenuStateOptions) {
  const [roomContextMenu, setRoomContextMenu] = useState<RoomContextMenu | null>(null);
  const activeRoom = useMemo(() => rooms.find((room) => room.id === activeRoomId) ?? null, [activeRoomId, rooms]);
  const roomNameCounts = useMemo(
    () =>
      rooms.reduce((counts, room) => {
        counts.set(room.name, (counts.get(room.name) ?? 0) + 1);
        return counts;
      }, new Map<string, number>()),
    [rooms]
  );
  const contextMenuRoom = useMemo(
    () => rooms.find((room) => room.id === roomContextMenu?.roomId) ?? null,
    [roomContextMenu?.roomId, rooms]
  );

  function roomSecondaryLabel(room: Room) {
    if ((roomNameCounts.get(room.name) ?? 0) <= 1) {
      return null;
    }
    return room.workspace_name ?? room.description ?? room.id.slice(-6);
  }

  useEffect(() => {
    if (!roomContextMenu) {
      return;
    }
    const closeMenu = () => setRoomContextMenu(null);
    window.addEventListener("click", closeMenu);
    window.addEventListener("keydown", closeMenu);
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("keydown", closeMenu);
    };
  }, [roomContextMenu]);

  return {
    activeRoom,
    contextMenuRoom,
    roomContextMenu,
    roomSecondaryLabel,
    setRoomContextMenu
  };
}
