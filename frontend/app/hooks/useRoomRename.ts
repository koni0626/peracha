"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Room } from "../types";
import { replaceRoom } from "./appSessionRoomState";
import { getErrorMessage } from "./mutationRunner";
import { updateRoomName } from "./roomManagementApi";

type UseRoomRenameOptions = {
  activeRoom: Room | null;
  roomEditName: string;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setRoomEditName: Dispatch<SetStateAction<string>>;
  setRooms: Dispatch<SetStateAction<Room[]>>;
};

export function useRoomRename({
  activeRoom,
  roomEditName,
  setChatNotice,
  setError,
  setRoomEditName,
  setRooms,
}: UseRoomRenameOptions) {
  async function updateRoomDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const roomName = roomEditName.trim();
    if (!activeRoom || !roomName) {
      return;
    }
    setError(null);
    try {
      const room = await updateRoomName(activeRoom.id, roomName);
      setRooms((current) => replaceRoom(current, room));
      setRoomEditName(room.name);
      setChatNotice(`ルーム名を「${room.name}」に変更しました`);
    } catch (err) {
      setError(getErrorMessage(err, "ルーム名の変更に失敗しました"));
    }
  }

  return {
    updateRoomDetails,
  };
}
