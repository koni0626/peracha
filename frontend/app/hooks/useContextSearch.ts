"use client";

import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { apiFetch } from "../api";
import type { Page, RelatedContext } from "../types";
import { runSavingMutation } from "./mutationRunner";

type UseContextSearchOptions = {
  activeRoomId: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useContextSearch({ activeRoomId, setError }: UseContextSearchOptions) {
  const [contextQuery, setContextQueryState] = useState("");
  const [contextResults, setContextResults] = useState<RelatedContext[]>([]);
  const [contextLoading, setContextLoading] = useState(false);

  function setContextQuery(value: string) {
    setContextQueryState(value);
    setContextResults([]);
  }

  async function searchContexts(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!activeRoomId) {
      return;
    }

    const query = contextQuery.trim().slice(0, 200);
    if (!query) {
      setContextResults([]);
      setError("検索キーワードを入力してください");
      return;
    }

    await runSavingMutation({ fallbackError: "文脈検索に失敗しました", setError, setSaving: setContextLoading }, async () => {
      const data = await apiFetch<Page<RelatedContext>>(
        `/api/rooms/${activeRoomId}/contexts?q=${encodeURIComponent(query)}&limit=6`
      );
      setContextResults(data.items);
      setContextQueryState(query);
    });
  }

  function resetContextSearchState() {
    setContextResults([]);
    setContextQueryState("");
  }

  return {
    contextQuery,
    setContextQuery,
    contextResults,
    contextLoading,
    searchContexts,
    resetContextSearchState,
  };
}
