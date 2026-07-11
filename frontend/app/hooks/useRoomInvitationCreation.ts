import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Invitation, User } from "../types";
import { getErrorMessage } from "./mutationRunner";
import { createRoomInvitation } from "./roomAccessApi";

type UseRoomInvitationCreationOptions = {
  activeRoomId: string | null;
  inviteEmail: string;
  inviteRole: string;
  loadInvitations: (roomId?: string | null, showError?: boolean) => Promise<void>;
  loadRoomMembers: (roomId?: string | null) => Promise<void>;
  setError: (message: string | null) => void;
  setInviteEmail: Dispatch<SetStateAction<string>>;
  setInviteResult: Dispatch<SetStateAction<Invitation | null>>;
  setUserSearchResults: Dispatch<SetStateAction<User[]>>;
};

export function useRoomInvitationCreation({
  activeRoomId,
  inviteEmail,
  inviteRole,
  loadInvitations,
  loadRoomMembers,
  setError,
  setInviteEmail,
  setInviteResult,
  setUserSearchResults,
}: UseRoomInvitationCreationOptions) {
  async function createInvitationForEmail(email: string) {
    if (!activeRoomId) {
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return;
    }
    setError(null);
    try {
      const invitation = await createRoomInvitation(activeRoomId, trimmedEmail, inviteRole);
      setInviteResult(invitation);
      setInviteEmail(trimmedEmail);
      setUserSearchResults((current) => current.filter((item) => item.email !== trimmedEmail));
      await loadRoomMembers();
      await loadInvitations();
    } catch (err) {
      setError(getErrorMessage(err, "招待に失敗しました"));
    }
  }

  async function createInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createInvitationForEmail(inviteEmail);
  }

  return {
    createInvitation,
    createInvitationForEmail,
  };
}
