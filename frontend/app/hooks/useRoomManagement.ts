"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Room } from "../types";
import { useRoomEditorState } from "./useRoomEditorState";
import { useRoomMenuState } from "./useRoomMenuState";
import { useRoomMutations } from "./useRoomMutations";

type UseRoomManagementOptions = {
  activeRoomId: string | null;
  activeRoomIdRef: RefObject<string | null>;
  rooms: Room[];
  roomsRef: RefObject<Room[]>;
  setActiveRoomId: Dispatch<SetStateAction<string | null>>;
  setRooms: Dispatch<SetStateAction<Room[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  prepareRoomEditor: () => void;
  loadRoomMembers: (roomId?: string | null) => Promise<void>;
  loadInvitations: (roomId?: string | null, showError?: boolean) => Promise<void>;
  resetAccessState: () => void;
  resetFacilitatorState: () => void;
  resetRealtimeState: () => void;
};

export function useRoomManagement({
  activeRoomId,
  activeRoomIdRef,
  rooms,
  roomsRef,
  setActiveRoomId,
  setRooms,
  setError,
  setChatNotice,
  prepareRoomEditor,
  loadRoomMembers,
  loadInvitations,
  resetAccessState,
  resetFacilitatorState,
  resetRealtimeState
}: UseRoomManagementOptions) {
  const { activeRoom, contextMenuRoom, roomContextMenu, roomSecondaryLabel, setRoomContextMenu } = useRoomMenuState({
    activeRoomId,
    rooms
  });
  const { roomEditOpen, roomEditName, openRoomEditor, setRoomEditName, setRoomEditOpen } = useRoomEditorState({
    roomsRef,
    setActiveRoomId,
    setRoomContextMenu,
    prepareRoomEditor,
    loadRoomMembers,
    loadInvitations
  });
  const { newRoomName, createRoom, deleteRoom, setNewRoomName, updateRoomDetails } = useRoomMutations({
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
  });

  return {
    activeRoom,
    contextMenuRoom,
    newRoomName,
    roomContextMenu,
    roomEditName,
    roomEditOpen,
    createRoom,
    deleteRoom,
    openRoomEditor,
    roomSecondaryLabel,
    setNewRoomName,
    setRoomContextMenu,
    setRoomEditName,
    setRoomEditOpen,
    updateRoomDetails
  };
}
