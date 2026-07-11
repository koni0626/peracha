import type { Room, WsEvent } from "../types";
import { removeRoomById, replaceRoom } from "./appSessionRoomState";
import type { RealtimeEventContext } from "./realtimeEventTypes";

export function handleRoomUpdated(payload: WsEvent, context: RealtimeEventContext) {
  const room = payload.data as Room;
  context.setRooms((current) => replaceRoom(current, room));
}

export function handleRoomDeleted(payload: WsEvent, context: RealtimeEventContext) {
  context.setRooms((current) => removeRoomById(current, payload.room_id));
  if (context.activeRoomIdRef.current !== payload.room_id) {
    return;
  }
  context.setActiveRoomId(null);
  context.setMessages([]);
  context.resetAccessState();
  context.setTasks([]);
  context.setChatNotice("表示中のルームが削除されました。");
}
