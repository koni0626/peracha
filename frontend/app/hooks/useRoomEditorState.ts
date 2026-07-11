"use client";

import { useState } from "react";
import type { RefObject } from "react";
import type { Room } from "../types";

type UseRoomEditorStateOptions = {
  roomsRef: RefObject<Room[]>;
  setActiveRoomId: (roomId: string | null) => void;
  setRoomContextMenu: (menu: null) => void;
  prepareRoomEditor: () => void;
  loadRoomMembers: (roomId?: string | null) => Promise<void>;
  loadInvitations: (roomId?: string | null, showError?: boolean) => Promise<void>;
};

export function useRoomEditorState({
  roomsRef,
  setActiveRoomId,
  setRoomContextMenu,
  prepareRoomEditor,
  loadRoomMembers,
  loadInvitations
}: UseRoomEditorStateOptions) {
  const [roomEditOpen, setRoomEditOpen] = useState(false);
  const [roomEditName, setRoomEditName] = useState("");

  async function openRoomEditor(roomId: string) {
    setRoomContextMenu(null);
    setActiveRoomId(roomId);
    setRoomEditName(roomsRef.current.find((room) => room.id === roomId)?.name ?? "");
    setRoomEditOpen(true);
    prepareRoomEditor();
    await Promise.all([loadRoomMembers(roomId), loadInvitations(roomId, true)]);
  }

  return {
    roomEditOpen,
    roomEditName,
    openRoomEditor,
    setRoomEditName,
    setRoomEditOpen
  };
}
