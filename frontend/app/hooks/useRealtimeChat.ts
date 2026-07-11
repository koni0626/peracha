"use client";

import { useBrowserNotifications } from "./useBrowserNotifications";
import { useInactiveRoomMessageSync } from "./useInactiveRoomMessageSync";
import type { UseRealtimeChatOptions } from "./realtimeChatTypes";
import { useRealtimeConnection } from "./useRealtimeConnection";
import { useRealtimeMessageState } from "./useRealtimeMessageState";
import { useRealtimeReset } from "./useRealtimeReset";
import { useRealtimeRoomIndicators } from "./useRealtimeRoomIndicators";

export function useRealtimeChat({
  activeRoomId,
  activeRoomIdRef,
  rooms,
  roomsRef,
  user,
  setActiveRoomId,
  setRooms,
  setTasks,
  setLatestDiagnosis,
  setDiagnosisHistory,
  setLatestCare,
  setCareHistory,
  setLatestBoard,
  setBoardSuggestion,
  setChatNotice,
  setError,
  resetAccessState,
  loadRoomMembers,
  loadInvitations
}: UseRealtimeChatOptions) {
  const { lastMessageAtRef, messages, resetRealtimeMessages, roomMessageCursorRef, setMessages } =
    useRealtimeMessageState();
  const { notificationPermission, requestNotifications, showBrowserNotification } = useBrowserNotifications({
    setActiveRoomId,
    setChatNotice,
    user
  });
  const {
    mentionedByRoom,
    resetRoomIndicators,
    setMentionedByRoom,
    setUnreadByRoom,
    unreadByRoom,
  } = useRealtimeRoomIndicators({ activeRoomId, activeRoomIdRef, rooms });
  const { connection, setConnection, closeConnection } = useRealtimeConnection({
    activeRoomId,
    activeRoomIdRef,
    user,
    roomMessageCursorRef,
    lastMessageAtRef,
    setActiveRoomId,
    setRooms,
    setMessages,
    setTasks,
    setLatestDiagnosis,
    setDiagnosisHistory,
    setLatestCare,
    setCareHistory,
    setLatestBoard,
    setBoardSuggestion,
    setChatNotice,
    setError,
    resetAccessState,
    loadRoomMembers,
    loadInvitations
  });
  const { resetRealtimeState } = useRealtimeReset({ resetRealtimeMessages, resetRoomIndicators, setConnection });

  useInactiveRoomMessageSync({
    activeRoomIdRef,
    rooms,
    roomsRef,
    roomMessageCursorRef,
    setMentionedByRoom,
    setUnreadByRoom,
    showBrowserNotification,
    user
  });

  return {
    messages,
    setMessages,
    connection,
    unreadByRoom,
    mentionedByRoom,
    notificationPermission,
    requestNotifications,
    resetRealtimeState,
    closeConnection
  };
}
