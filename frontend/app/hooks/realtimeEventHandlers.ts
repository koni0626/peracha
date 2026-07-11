"use client";

import type { Message, WsEvent } from "../types";
import { handleRealtimeArtifactEvent } from "./realtimeArtifactEventHandlers";
import type { RealtimeEventContext } from "./realtimeEventTypes";
import { reportRealtimeError } from "./realtimeErrorUtils";
import { handleRoomDeleted, handleRoomUpdated } from "./realtimeRoomEventHandlers";

export function processRealtimeEvent(payload: WsEvent, context: RealtimeEventContext) {
  if (payload.event === "room.deleted") {
    handleRoomDeleted(payload, context);
    return;
  }
  if (payload.event === "room.updated") {
    handleRoomUpdated(payload, context);
    return;
  }
  if (payload.room_id !== context.activeRoomId) {
    return;
  }

  if (payload.event === "message.created") {
    handleMessageCreated(payload, context);
    return;
  }
  if (payload.event === "message.read_state.updated") {
    handleMessageReadStateUpdated(payload, context);
    return;
  }
  handleRealtimeArtifactEvent(payload, context);
}

function handleMessageCreated(payload: WsEvent, context: RealtimeEventContext) {
  const message = payload.data as Message;
  context.roomMessageCursorRef.current[payload.room_id] = message.created_at;
  if (message.thread_id) {
    context.fetchMessages(null, false).catch(reportRealtimeError(context.setError, "メッセージの取得に失敗しました"));
    return;
  }
  context.mergeMessages([message]);
  context.markRoomRead(message.id).catch(reportRealtimeError(context.setError, "既読状態の更新に失敗しました"));
}

function handleMessageReadStateUpdated(payload: WsEvent, context: RealtimeEventContext) {
  const data = payload.data as { reader_user_id?: string };
  if (data.reader_user_id !== context.user.id) {
    context.fetchMessages(null, false).catch(reportRealtimeError(context.setError, "メッセージの取得に失敗しました"));
  }
}
