"use client";

import { useEffect, useRef, useState } from "react";
import { websocketUrl } from "../api";
import { loadRealtimeRoomInitialData } from "./realtimeConnectionStartup";
import type { RealtimeConnectionState, UseRealtimeConnectionOptions } from "./realtimeConnectionTypes";
import { createRealtimeRoomSync } from "./realtimeRoomSync";
import { attachRealtimeSocketHandlers } from "./realtimeSocketHandlers";

export function useRealtimeConnection(options: UseRealtimeConnectionOptions) {
  const {
    activeRoomId,
    user,
    roomMessageCursorRef,
    lastMessageAtRef,
    setMessages,
    setTasks,
    setError,
  } = options;
  const [connection, setConnection] = useState<RealtimeConnectionState>("offline");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function closeConnection() {
    wsRef.current?.close();
  }

  useEffect(() => {
    if (!activeRoomId || !user) {
      return;
    }

    let disposed = false;
    let reconnectAttempts = 0;
    const roomSync = createRealtimeRoomSync({
      activeRoomId,
      lastMessageAtRef,
      roomMessageCursorRef,
      setError,
      setMessages,
      setTasks,
    });

    const connect = () => {
      if (disposed) {
        return;
      }
      setConnection("connecting");
      const socket = new WebSocket(websocketUrl(activeRoomId));
      wsRef.current = socket;

      attachRealtimeSocketHandlers({
        activeRoomId,
        isDisposed: () => disposed,
        onOpen: () => {
          reconnectAttempts = 0;
          setConnection("online");
        },
        options,
        roomSync,
        scheduleReconnect: () => {
          setConnection("offline");
          reconnectAttempts += 1;
          reconnectTimerRef.current = setTimeout(connect, Math.min(8000, 1000 * reconnectAttempts));
        },
        socket,
        wsRef,
      });
    };

    loadRealtimeRoomInitialData({ activeRoomId, options, roomSync });
    wsRef.current?.close();
    connect();

    return () => {
      disposed = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      wsRef.current?.close();
    };
  }, [activeRoomId, user]);

  return {
    connection,
    setConnection,
    closeConnection
  };
}
