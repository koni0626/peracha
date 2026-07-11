"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Room } from "../types";
import { useRoomCreation } from "./useRoomCreation";
import { useRoomDeletion } from "./useRoomDeletion";
import { useRoomRename } from "./useRoomRename";

type UseRoomMutationsOptions = {
  activeRoom: Room | null;
  activeRoomIdRef: RefObject<string | null>;
  roomEditName: string;
  setActiveRoomId: Dispatch<SetStateAction<string | null>>;
  setRooms: Dispatch<SetStateAction<Room[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setRoomContextMenu: (menu: null) => void;
  setRoomEditName: Dispatch<SetStateAction<string>>;
  resetAccessState: () => void;
  resetFacilitatorState: () => void;
  resetRealtimeState: () => void;
};

export function useRoomMutations({
  activeRoom,
  activeRoomIdRef,
  roomEditName,
  setActiveRoomId,
  setRooms,
  setError,
  setChatNotice,
  setRoomContextMenu,
  setRoomEditName,
  resetAccessState,
  resetFacilitatorState,
  resetRealtimeState
}: UseRoomMutationsOptions) {
  function resetRoomScopedState() {
    resetFacilitatorState();
    resetAccessState();
  }

  function clearActiveRoomState() {
    setActiveRoomId(null);
    resetRealtimeState();
    resetRoomScopedState();
  }

  const { createRoom, newRoomName, setNewRoomName } = useRoomCreation({
    resetRoomScopedState,
    setActiveRoomId,
    setError,
    setRooms,
  });

  const { deleteRoom } = useRoomDeletion({
    activeRoomIdRef,
    clearActiveRoomState,
    setChatNotice,
    setError,
    setRoomContextMenu,
    setRooms,
  });

  const { updateRoomDetails } = useRoomRename({
    activeRoom,
    roomEditName,
    setChatNotice,
    setError,
    setRoomEditName,
    setRooms,
  });

  return {
    newRoomName,
    createRoom,
    deleteRoom,
    setNewRoomName,
    updateRoomDetails
  };
}
