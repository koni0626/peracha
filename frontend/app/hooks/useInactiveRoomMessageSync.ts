"use client";

import { useEffect } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";

import { apiFetch } from "../api";
import type { Message, Room, User } from "../types";
import { summarizeInactiveRoomMessages } from "./inactiveRoomMessageSummary";
import { roomMessagesPath } from "./realtimeMessageUtils";

type UseInactiveRoomMessageSyncOptions = {
  activeRoomIdRef: RefObject<string | null>;
  rooms: Room[];
  roomsRef: RefObject<Room[]>;
  roomMessageCursorRef: RefObject<Record<string, string | null>>;
  setMentionedByRoom: Dispatch<SetStateAction<Record<string, boolean>>>;
  setUnreadByRoom: Dispatch<SetStateAction<Record<string, number>>>;
  showBrowserNotification: (room: Room, message: Message, isMention: boolean) => void;
  user: User | null;
};

export function useInactiveRoomMessageSync({
  activeRoomIdRef,
  rooms,
  roomsRef,
  roomMessageCursorRef,
  setMentionedByRoom,
  setUnreadByRoom,
  showBrowserNotification,
  user,
}: UseInactiveRoomMessageSyncOptions) {
  useEffect(() => {
    if (!user) {
      return;
    }
    let disposed = false;
    const syncInactiveMessages = async () => {
      for (const room of roomsRef.current) {
        if (disposed || room.id === activeRoomIdRef.current) {
          continue;
        }
        const cursor = roomMessageCursorRef.current[room.id];
        try {
          const data = await apiFetch<{ items: Message[] }>(roomMessagesPath(room.id, cursor));
          if (!data.items.length) {
            continue;
          }
          roomMessageCursorRef.current[room.id] = data.items[data.items.length - 1].created_at;
          if (!cursor) {
            continue;
          }
          const summary = summarizeInactiveRoomMessages(data.items, user);
          if (!summary.incoming.length || !summary.lastIncoming) {
            continue;
          }
          setUnreadByRoom((current) => ({ ...current, [room.id]: (current[room.id] ?? 0) + summary.incoming.length }));
          if (summary.hasMention) {
            setMentionedByRoom((current) => ({ ...current, [room.id]: true }));
          }
          showBrowserNotification(room, summary.lastIncoming, summary.lastIncomingMentioned);
        } catch {
          continue;
        }
      }
    };
    syncInactiveMessages();
    const interval = window.setInterval(syncInactiveMessages, 5000);
    return () => {
      disposed = true;
      window.clearInterval(interval);
    };
  }, [
    activeRoomIdRef,
    roomMessageCursorRef,
    rooms,
    roomsRef,
    setMentionedByRoom,
    setUnreadByRoom,
    showBrowserNotification,
    user,
  ]);
}
