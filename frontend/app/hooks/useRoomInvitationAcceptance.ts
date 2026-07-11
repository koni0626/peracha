import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Room } from "../types";
import { appendUniqueRoom } from "./appSessionRoomState";
import { getErrorMessage } from "./mutationRunner";
import { acceptRoomInvitationToken } from "./roomAccessApi";

type UseRoomInvitationAcceptanceOptions = {
  acceptToken: string;
  loadInvitations: (roomId?: string | null, showError?: boolean) => Promise<void>;
  loadRoomMembers: (roomId?: string | null) => Promise<void>;
  setAcceptToken: Dispatch<SetStateAction<string>>;
  setActiveRoomId: (roomId: string | null) => void;
  setError: (message: string | null) => void;
  setRooms: Dispatch<SetStateAction<Room[]>>;
};

export function useRoomInvitationAcceptance({
  acceptToken,
  loadInvitations,
  loadRoomMembers,
  setAcceptToken,
  setActiveRoomId,
  setError,
  setRooms,
}: UseRoomInvitationAcceptanceOptions) {
  async function acceptInvitationToken(token: string) {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      return;
    }
    setError(null);
    try {
      const result = await acceptRoomInvitationToken(trimmedToken);
      setRooms((current) => appendUniqueRoom(current, result.room));
      setActiveRoomId(result.room.id);
      setAcceptToken("");
      await loadRoomMembers(result.room.id);
      await loadInvitations(result.room.id);
    } catch (err) {
      setError(getErrorMessage(err, "招待参加に失敗しました"));
    }
  }

  async function acceptInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await acceptInvitationToken(acceptToken);
  }

  return {
    acceptInvitation,
    acceptInvitationToken,
  };
}
