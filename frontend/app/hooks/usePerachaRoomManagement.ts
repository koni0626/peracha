import type { Dispatch, SetStateAction } from "react";

import type { AppSession, FacilitatorTools, RealtimeChat, RoomAccess } from "./perachaAppTypes";
import { useRoomManagement } from "./useRoomManagement";

type UsePerachaRoomManagementOptions = {
  access: RoomAccess;
  facilitator: FacilitatorTools;
  realtime: RealtimeChat;
  session: AppSession;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function usePerachaRoomManagement({
  access,
  facilitator,
  realtime,
  session,
  setChatNotice,
  setError,
}: UsePerachaRoomManagementOptions) {
  return useRoomManagement({
    activeRoomId: session.activeRoomId,
    activeRoomIdRef: session.activeRoomIdRef,
    rooms: session.rooms,
    roomsRef: session.roomsRef,
    setActiveRoomId: session.setActiveRoomId,
    setRooms: session.setRooms,
    setError,
    setChatNotice,
    prepareRoomEditor: access.prepareRoomEditor,
    loadRoomMembers: access.loadRoomMembers,
    loadInvitations: access.loadInvitations,
    resetAccessState: access.resetAccessState,
    resetFacilitatorState: facilitator.resetFacilitatorState,
    resetRealtimeState: realtime.resetRealtimeState,
  });
}
