import type { UseRealtimeConnectionOptions } from "./realtimeConnectionTypes";
import type { RealtimeEventContext } from "./realtimeEventTypes";
import type { createRealtimeRoomSync } from "./realtimeRoomSync";

type RealtimeRoomSync = ReturnType<typeof createRealtimeRoomSync>;

type CreateRealtimeEventContextOptions = {
  activeRoomId: string;
  options: UseRealtimeConnectionOptions;
  roomSync: RealtimeRoomSync;
};

export function createRealtimeEventContext({
  activeRoomId,
  options,
  roomSync,
}: CreateRealtimeEventContextOptions): RealtimeEventContext | null {
  if (!options.user) {
    return null;
  }
  return {
    activeRoomId,
    activeRoomIdRef: options.activeRoomIdRef,
    user: options.user,
    roomMessageCursorRef: options.roomMessageCursorRef,
    setActiveRoomId: options.setActiveRoomId,
    setRooms: options.setRooms,
    setMessages: options.setMessages,
    setTasks: options.setTasks,
    setLatestDiagnosis: options.setLatestDiagnosis,
    setDiagnosisHistory: options.setDiagnosisHistory,
    setLatestCare: options.setLatestCare,
    setCareHistory: options.setCareHistory,
    setLatestBoard: options.setLatestBoard,
    setBoardSuggestion: options.setBoardSuggestion,
    setChatNotice: options.setChatNotice,
    setError: options.setError,
    resetAccessState: options.resetAccessState,
    mergeMessages: roomSync.mergeMessages,
    markRoomRead: roomSync.markRoomRead,
    fetchMessages: roomSync.fetchMessages,
  };
}
