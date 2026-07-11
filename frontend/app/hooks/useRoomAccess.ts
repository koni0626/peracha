"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Room } from "../types";
import { useRoomInvitationAccess } from "./useRoomInvitationAccess";
import { useRoomMemberAccess } from "./useRoomMemberAccess";

type UseRoomAccessOptions = {
  activeRoomId: string | null;
  setActiveRoomId: (roomId: string | null) => void;
  setError: (message: string | null) => void;
  setRooms: Dispatch<SetStateAction<Room[]>>;
};

export function useRoomAccess({ activeRoomId, setActiveRoomId, setError, setRooms }: UseRoomAccessOptions) {
  const [inviteRole, setInviteRole] = useState("member");
  const memberAccess = useRoomMemberAccess({ activeRoomId, inviteRole, setError });
  const invitationAccess = useRoomInvitationAccess({
    activeRoomId,
    inviteRole,
    setActiveRoomId,
    setError,
    setRooms,
    loadRoomMembers: memberAccess.loadRoomMembers,
    setUserSearchResults: memberAccess.setUserSearchResults
  });

  function resetAccessState() {
    memberAccess.resetMemberAccessState();
    invitationAccess.resetInvitationAccessState();
  }

  function prepareRoomEditor() {
    memberAccess.prepareMemberEditor();
    invitationAccess.prepareInvitationEditor();
  }

  async function addRegisteredUser(candidate: Parameters<typeof memberAccess.addRegisteredUser>[0]) {
    await memberAccess.addRegisteredUser(candidate);
    invitationAccess.prepareInvitationEditor();
  }

  return {
    roomMembers: memberAccess.roomMembers,
    setRoomMembers: memberAccess.setRoomMembers,
    inviteEmail: invitationAccess.inviteEmail,
    setInviteEmail: invitationAccess.setInviteEmail,
    inviteRole,
    setInviteRole,
    inviteResult: invitationAccess.inviteResult,
    invitations: invitationAccess.invitations,
    userSearchQuery: memberAccess.userSearchQuery,
    setUserSearchQuery: memberAccess.setUserSearchQuery,
    userSearchResults: memberAccess.userSearchResults,
    userSearchLoading: memberAccess.userSearchLoading,
    acceptToken: invitationAccess.acceptToken,
    setAcceptToken: invitationAccess.setAcceptToken,
    resetAccessState,
    prepareRoomEditor,
    loadRoomMembers: memberAccess.loadRoomMembers,
    loadInvitations: invitationAccess.loadInvitations,
    createInvitation: invitationAccess.createInvitation,
    searchRegisteredUsers: memberAccess.searchRegisteredUsers,
    addRegisteredUser,
    acceptInvitationToken: invitationAccess.acceptInvitationToken,
    acceptInvitation: invitationAccess.acceptInvitation,
    revokeInvitation: invitationAccess.revokeInvitation,
    updateRoomMember: memberAccess.updateRoomMember,
    removeRoomMember: memberAccess.removeRoomMember
  };
}
