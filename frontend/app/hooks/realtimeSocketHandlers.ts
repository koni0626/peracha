import type { RefObject } from "react";

import type { WsEvent } from "../types";
import { createRealtimeEventContext } from "./realtimeEventContext";
import type { UseRealtimeConnectionOptions } from "./realtimeConnectionTypes";
import { processRealtimeEvent } from "./realtimeEventHandlers";
import type { createRealtimeRoomSync } from "./realtimeRoomSync";
import { getErrorMessage } from "./mutationRunner";

type RealtimeRoomSync = ReturnType<typeof createRealtimeRoomSync>;

type AttachRealtimeSocketHandlersOptions = {
  activeRoomId: string;
  isDisposed: () => boolean;
  onOpen: () => void;
  options: UseRealtimeConnectionOptions;
  roomSync: RealtimeRoomSync;
  scheduleReconnect: () => void;
  socket: WebSocket;
  wsRef: RefObject<WebSocket | null>;
};

export function attachRealtimeSocketHandlers({
  activeRoomId,
  isDisposed,
  onOpen,
  options,
  roomSync,
  scheduleReconnect,
  socket,
  wsRef,
}: AttachRealtimeSocketHandlersOptions) {
  socket.onopen = () => {
    onOpen();
    roomSync
      .fetchMessages(options.lastMessageAtRef.current)
      .catch((err: unknown) => options.setError(getErrorMessage(err, "メッセージの取得に失敗しました")));
  };
  socket.onclose = () => {
    if (wsRef.current === socket) {
      wsRef.current = null;
    }
    if (!isDisposed()) {
      scheduleReconnect();
    }
  };
  socket.onerror = () => socket.close();
  socket.onmessage = (event) => {
    const payload = JSON.parse(event.data) as WsEvent;
    const context = createRealtimeEventContext({ activeRoomId, options, roomSync });
    if (context) {
      processRealtimeEvent(payload, context);
    }
  };
}
