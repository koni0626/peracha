"use client";

import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Room } from "../types";
import { appendUniqueRoom } from "./appSessionRoomState";
import { getErrorMessage } from "./mutationRunner";
import { createRoomForWorkspace } from "./roomManagementApi";

type UseRoomCreationOptions = {
  resetRoomScopedState: () => void;
  setActiveRoomId: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setRooms: Dispatch<SetStateAction<Room[]>>;
};

export function useRoomCreation({
  resetRoomScopedState,
  setActiveRoomId,
  setError,
  setRooms,
}: UseRoomCreationOptions) {
  const [newRoomName, setNewRoomName] = useState("提案資料の更新");

  async function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const roomName = newRoomName.trim();
    if (!roomName) {
      return;
    }
    setError(null);
    try {
      const room = await createRoomForWorkspace(roomName);
      setRooms((current) => appendUniqueRoom(current, room));
      setActiveRoomId(room.id);
      resetRoomScopedState();
      setNewRoomName("");
    } catch (err) {
      setError(getErrorMessage(err, "ルーム作成に失敗しました"));
    }
  }

  return {
    createRoom,
    newRoomName,
    setNewRoomName,
  };
}
