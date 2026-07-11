import { useEffect, useState } from "react";
import type { RefObject } from "react";

import type { Room } from "../types";

type UseRealtimeRoomIndicatorsOptions = {
  activeRoomId: string | null;
  activeRoomIdRef: RefObject<string | null>;
  rooms: Room[];
};

export function useRealtimeRoomIndicators({ activeRoomId, activeRoomIdRef, rooms }: UseRealtimeRoomIndicatorsOptions) {
  const [unreadByRoom, setUnreadByRoom] = useState<Record<string, number>>({});
  const [mentionedByRoom, setMentionedByRoom] = useState<Record<string, boolean>>({});

  function resetRoomIndicators() {
    setUnreadByRoom({});
    setMentionedByRoom({});
  }

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
    if (activeRoomId) {
      setUnreadByRoom((current) => ({ ...current, [activeRoomId]: 0 }));
      setMentionedByRoom((current) => ({ ...current, [activeRoomId]: false }));
    }
  }, [activeRoomId, activeRoomIdRef]);

  useEffect(() => {
    setUnreadByRoom((current) =>
      rooms.reduce<Record<string, number>>((next, room) => {
        next[room.id] = room.id === activeRoomIdRef.current ? 0 : current[room.id] ?? room.unread_count;
        return next;
      }, {})
    );
  }, [activeRoomIdRef, rooms]);

  useEffect(() => {
    const totalUnread = Object.values(unreadByRoom).reduce((sum, count) => sum + count, 0);
    document.title = totalUnread > 0 ? `(${totalUnread}) ペラチャ` : "ペラチャ";
  }, [unreadByRoom]);

  return {
    mentionedByRoom,
    resetRoomIndicators,
    setMentionedByRoom,
    setUnreadByRoom,
    unreadByRoom,
  };
}
