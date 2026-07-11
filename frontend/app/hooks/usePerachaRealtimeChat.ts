import type { Dispatch, SetStateAction } from "react";

import type { AppSession, FacilitatorTools, RoomAccess } from "./perachaAppTypes";
import { useRealtimeChat } from "./useRealtimeChat";

type UsePerachaRealtimeChatOptions = {
  access: RoomAccess;
  facilitator: FacilitatorTools;
  session: AppSession;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function usePerachaRealtimeChat({
  access,
  facilitator,
  session,
  setChatNotice,
  setError,
}: UsePerachaRealtimeChatOptions) {
  return useRealtimeChat({
    activeRoomId: session.activeRoomId,
    activeRoomIdRef: session.activeRoomIdRef,
    rooms: session.rooms,
    roomsRef: session.roomsRef,
    user: session.user,
    setActiveRoomId: session.setActiveRoomId,
    setRooms: session.setRooms,
    setTasks: facilitator.setTasks,
    setLatestDiagnosis: facilitator.setLatestDiagnosis,
    setDiagnosisHistory: facilitator.setDiagnosisHistory,
    setLatestCare: facilitator.setLatestCare,
    setCareHistory: facilitator.setCareHistory,
    setLatestBoard: facilitator.setLatestBoard,
    setBoardSuggestion: facilitator.setBoardSuggestion,
    setChatNotice,
    setError,
    resetAccessState: access.resetAccessState,
    loadRoomMembers: access.loadRoomMembers,
    loadInvitations: access.loadInvitations,
  });
}
