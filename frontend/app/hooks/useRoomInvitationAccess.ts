"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import type { Invitation, Room, User } from "../types";
import { useRoomInvitationAcceptance } from "./useRoomInvitationAcceptance";
import { useRoomInvitationCreation } from "./useRoomInvitationCreation";
import { useRoomInvitationList } from "./useRoomInvitationList";

type UseRoomInvitationAccessOptions = {
  activeRoomId: string | null;
  inviteRole: string;
  setActiveRoomId: (roomId: string | null) => void;
  setError: (message: string | null) => void;
  setRooms: Dispatch<SetStateAction<Room[]>>;
  loadRoomMembers: (roomId?: string | null) => Promise<void>;
  setUserSearchResults: Dispatch<SetStateAction<User[]>>;
};

export function useRoomInvitationAccess({
  activeRoomId,
  inviteRole,
  setActiveRoomId,
  setError,
  setRooms,
  loadRoomMembers,
  setUserSearchResults
}: UseRoomInvitationAccessOptions) {
  const [inviteEmail, setInviteEmail] = useState("partner@example.com");
  const [inviteResult, setInviteResult] = useState<Invitation | null>(null);
  const [acceptToken, setAcceptToken] = useState("");
  const { invitations, loadInvitations, resetInvitationList, revokeInvitation } = useRoomInvitationList({
    activeRoomId,
    setError,
  });

  function resetInvitationAccessState() {
    setInviteResult(null);
    resetInvitationList();
  }

  function prepareInvitationEditor() {
    setInviteResult(null);
  }

  const { createInvitation, createInvitationForEmail } = useRoomInvitationCreation({
    activeRoomId,
    inviteEmail,
    inviteRole,
    loadInvitations,
    loadRoomMembers,
    setError,
    setInviteEmail,
    setInviteResult,
    setUserSearchResults,
  });
  const { acceptInvitation, acceptInvitationToken } = useRoomInvitationAcceptance({
    acceptToken,
    loadInvitations,
    loadRoomMembers,
    setAcceptToken,
    setActiveRoomId,
    setError,
    setRooms,
  });

  return {
    inviteEmail,
    setInviteEmail,
    inviteResult,
    invitations,
    acceptToken,
    setAcceptToken,
    resetInvitationAccessState,
    prepareInvitationEditor,
    loadInvitations,
    createInvitation,
    acceptInvitationToken,
    acceptInvitation,
    revokeInvitation
  };
}
