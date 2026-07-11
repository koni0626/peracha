"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";

import type { Room } from "../types";
import { removeRoomById } from "./appSessionRoomState";
import { getErrorMessage } from "./mutationRunner";
import { deleteRoomById } from "./roomManagementApi";

type UseRoomDeletionOptions = {
  activeRoomIdRef: RefObject<string | null>;
  clearActiveRoomState: () => void;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setRoomContextMenu: (menu: null) => void;
  setRooms: Dispatch<SetStateAction<Room[]>>;
};

export function useRoomDeletion({
  activeRoomIdRef,
  clearActiveRoomState,
  setChatNotice,
  setError,
  setRoomContextMenu,
  setRooms,
}: UseRoomDeletionOptions) {
  async function deleteRoom(room: Room) {
    setRoomContextMenu(null);
    const confirmed = window.confirm(
      `ルーム「${room.name}」を削除します。メッセージやタスクも削除されます。よろしいですか？`
    );
    if (!confirmed) {
      return;
    }
    setError(null);
    try {
      await deleteRoomById(room.id);
      setRooms((current) => removeRoomById(current, room.id));
      if (activeRoomIdRef.current === room.id) {
        clearActiveRoomState();
      }
      setChatNotice(`ルーム「${room.name}」を削除しました`);
    } catch (err) {
      setError(getErrorMessage(err, "ルーム削除に失敗しました"));
    }
  }

  return {
    deleteRoom,
  };
}
