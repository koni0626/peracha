import { useState } from "react";

import type { Invitation } from "../types";
import { replaceById } from "./idListUtils";
import { getErrorMessage } from "./mutationRunner";
import { fetchRoomInvitations, revokeRoomInvitation } from "./roomAccessApi";

type UseRoomInvitationListOptions = {
  activeRoomId: string | null;
  setError: (message: string | null) => void;
};

export function useRoomInvitationList({ activeRoomId, setError }: UseRoomInvitationListOptions) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  function resetInvitationList() {
    setInvitations([]);
  }

  async function loadInvitations(roomId = activeRoomId, showError = false) {
    if (!roomId) {
      return;
    }
    try {
      const data = await fetchRoomInvitations(roomId);
      setInvitations(data.items);
    } catch (err) {
      setInvitations([]);
      if (showError) {
        setError(getErrorMessage(err, "招待一覧の取得に失敗しました"));
      }
    }
  }

  async function revokeInvitation(invitationId: string) {
    if (!activeRoomId) {
      return;
    }
    setError(null);
    try {
      const invitation = await revokeRoomInvitation(activeRoomId, invitationId);
      setInvitations((current) => replaceById(current, invitation));
    } catch (err) {
      setError(getErrorMessage(err, "招待の取り消しに失敗しました"));
    }
  }

  return {
    invitations,
    loadInvitations,
    resetInvitationList,
    revokeInvitation,
  };
}
