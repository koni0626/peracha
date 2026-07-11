"use client";

import type { Dispatch, SetStateAction } from "react";

import type { RoomMember, User } from "../types";
import { getErrorMessage } from "./mutationRunner";
import { addRoomMember, deleteRoomMember, patchRoomMemberRole } from "./roomAccessApi";
import {
  addUniqueRoomMember,
  removeRoomMemberById,
  removeUserSearchCandidate,
  replaceRoomMember,
} from "./roomMemberStateUtils";

type UseRoomMemberMutationsOptions = {
  activeRoomId: string | null;
  inviteRole: string;
  loadRoomMembers: () => Promise<void>;
  setError: (message: string | null) => void;
  setRoomMembers: Dispatch<SetStateAction<RoomMember[]>>;
  setUserSearchResults: Dispatch<SetStateAction<User[]>>;
};

export function useRoomMemberMutations({
  activeRoomId,
  inviteRole,
  loadRoomMembers,
  setError,
  setRoomMembers,
  setUserSearchResults,
}: UseRoomMemberMutationsOptions) {
  async function addRegisteredUser(candidate: User) {
    if (!activeRoomId) {
      return;
    }
    setError(null);
    try {
      const member = await addRoomMember(activeRoomId, candidate.id, inviteRole);
      setRoomMembers((current) => addUniqueRoomMember(current, member));
      setUserSearchResults((current) => removeUserSearchCandidate(current, candidate.id));
    } catch (err) {
      setError(getErrorMessage(err, "ユーザー追加に失敗しました"));
      await loadRoomMembers();
    }
  }

  async function updateRoomMember(memberId: string, role: string) {
    if (!activeRoomId) {
      return;
    }
    setError(null);
    try {
      const member = await patchRoomMemberRole(activeRoomId, memberId, role);
      setRoomMembers((current) => replaceRoomMember(current, member));
    } catch (err) {
      setError(getErrorMessage(err, "メンバー権限の更新に失敗しました"));
      await loadRoomMembers();
    }
  }

  async function removeRoomMember(memberId: string) {
    if (!activeRoomId) {
      return;
    }
    setError(null);
    try {
      const member = await deleteRoomMember(activeRoomId, memberId);
      setRoomMembers((current) => removeRoomMemberById(current, member.id));
    } catch (err) {
      setError(getErrorMessage(err, "メンバー削除に失敗しました"));
      await loadRoomMembers();
    }
  }

  return {
    addRegisteredUser,
    removeRoomMember,
    updateRoomMember,
  };
}
