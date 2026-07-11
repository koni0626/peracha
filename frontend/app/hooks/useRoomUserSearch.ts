"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import type { User } from "../types";
import { runSavingMutation } from "./mutationRunner";
import { searchUsersForRoom } from "./roomAccessApi";

type UseRoomUserSearchOptions = {
  activeRoomId: string | null;
  setError: (message: string | null) => void;
};

export function useRoomUserSearch({ activeRoomId, setError }: UseRoomUserSearchOptions) {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  function resetUserSearch() {
    setUserSearchQuery("");
    setUserSearchResults([]);
  }

  async function searchRegisteredUsers(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!activeRoomId) {
      return;
    }
    await runSavingMutation({ fallbackError: "ユーザー検索に失敗しました", setError, setSaving: setUserSearchLoading }, async () => {
      const data = await searchUsersForRoom(activeRoomId, userSearchQuery.trim());
      setUserSearchResults(data.items);
    });
  }

  return {
    userSearchQuery,
    setUserSearchQuery,
    userSearchResults,
    setUserSearchResults,
    userSearchLoading,
    resetUserSearch,
    searchRegisteredUsers,
  };
}
