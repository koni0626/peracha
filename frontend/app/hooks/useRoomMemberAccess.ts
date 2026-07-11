"use client";

import { useState } from "react";

import type { RoomMember } from "../types";
import { getErrorMessage } from "./mutationRunner";
import { fetchRoomMembers } from "./roomAccessApi";
import { useRoomMemberMutations } from "./useRoomMemberMutations";
import { useRoomUserSearch } from "./useRoomUserSearch";

type UseRoomMemberAccessOptions = {
  activeRoomId: string | null;
  inviteRole: string;
  setError: (message: string | null) => void;
};

export function useRoomMemberAccess({ activeRoomId, inviteRole, setError }: UseRoomMemberAccessOptions) {
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const userSearch = useRoomUserSearch({ activeRoomId, setError });

  function resetMemberAccessState() {
    setRoomMembers([]);
    userSearch.resetUserSearch();
  }

  function prepareMemberEditor() {
    userSearch.resetUserSearch();
  }

  async function loadRoomMembers(roomId = activeRoomId) {
    if (!roomId) {
      return;
    }
    setError(null);
    try {
      const data = await fetchRoomMembers(roomId);
      setRoomMembers(data.items);
    } catch (err) {
      setError(getErrorMessage(err, "メンバー一覧の取得に失敗しました"));
    }
  }

  const memberMutations = useRoomMemberMutations({
    activeRoomId,
    inviteRole,
    loadRoomMembers,
    setError,
    setRoomMembers,
    setUserSearchResults: userSearch.setUserSearchResults,
  });

  return {
    roomMembers,
    setRoomMembers,
    userSearchQuery: userSearch.userSearchQuery,
    setUserSearchQuery: userSearch.setUserSearchQuery,
    userSearchResults: userSearch.userSearchResults,
    setUserSearchResults: userSearch.setUserSearchResults,
    userSearchLoading: userSearch.userSearchLoading,
    resetMemberAccessState,
    prepareMemberEditor,
    loadRoomMembers,
    searchRegisteredUsers: userSearch.searchRegisteredUsers,
    addRegisteredUser: memberMutations.addRegisteredUser,
    updateRoomMember: memberMutations.updateRoomMember,
    removeRoomMember: memberMutations.removeRoomMember,
  };
}
