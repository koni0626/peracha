"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import { apiFetch } from "../api";
import type { Board, BoardSuggestion, CareIntervention } from "../types";
import { prependUniqueById } from "./idListUtils";
import { getErrorMessage } from "./mutationRunner";

type UseFacilitatorArtifactsOptions = {
  activeRoomId: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useFacilitatorArtifacts({ activeRoomId, setError }: UseFacilitatorArtifactsOptions) {
  const [latestBoard, setLatestBoard] = useState<Board | null>(null);
  const [boardSuggestion, setBoardSuggestion] = useState<BoardSuggestion | null>(null);
  const [latestCare, setLatestCare] = useState<CareIntervention | null>(null);
  const [careHistory, setCareHistory] = useState<CareIntervention[]>([]);

  async function createNowHereBoard(trigger = "manual", messageIds?: string[]) {
    if (!activeRoomId) {
      return;
    }
    setError(null);
    try {
      const board = await apiFetch<Board>("/api/boards", {
        method: "POST",
        body: JSON.stringify({ room_id: activeRoomId, trigger, message_ids: messageIds })
      });
      setLatestBoard(board);
      setBoardSuggestion(null);
    } catch (err) {
      setError(getErrorMessage(err, "今ここボード生成に失敗しました"));
    }
  }

  async function createCareIntervention() {
    if (!activeRoomId) {
      return;
    }
    setError(null);
    try {
      const care = await apiFetch<CareIntervention>("/api/care-interventions", {
        method: "POST",
        body: JSON.stringify({ room_id: activeRoomId, trigger: "manual" })
      });
      setLatestCare(care);
      setCareHistory((current) => prependUniqueById(current, care, 10));
    } catch (err) {
      setError(getErrorMessage(err, "賢者ケアに失敗しました"));
    }
  }

  function resetArtifactState() {
    setLatestBoard(null);
    setBoardSuggestion(null);
    setLatestCare(null);
    setCareHistory([]);
  }

  return {
    latestBoard,
    setLatestBoard,
    boardSuggestion,
    setBoardSuggestion,
    latestCare,
    setLatestCare,
    careHistory,
    setCareHistory,
    createNowHereBoard,
    createCareIntervention,
    resetArtifactState,
  };
}
