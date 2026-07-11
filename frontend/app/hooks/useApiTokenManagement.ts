"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { writeClipboardText } from "../clipboard";
import type { ApiToken } from "../types";
import { createApiTokenForClient, fetchApiTokens, revokeApiClientToken } from "./apiIntegrationApi";
import { getErrorMessage } from "./mutationRunner";

type UseApiTokenManagementOptions = {
  selectedApiClientId: string | null;
  setApiNotice: (message: string | null) => void;
  setError: (message: string | null) => void;
};

export function useApiTokenManagement({ selectedApiClientId, setApiNotice, setError }: UseApiTokenManagementOptions) {
  const [apiTokens, setApiTokens] = useState<ApiToken[]>([]);
  const [tokenName, setTokenName] = useState("local-codex");
  const [issuedToken, setIssuedToken] = useState<ApiToken | null>(null);

  function resetApiTokens() {
    setApiTokens([]);
    setIssuedToken(null);
  }

  async function loadApiTokens(clientId: string) {
    const data = await fetchApiTokens(clientId);
    setApiTokens(data.items);
  }

  async function createApiToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedApiClientId) {
      return;
    }
    setError(null);
    setApiNotice(null);
    try {
      const token = await createApiTokenForClient(selectedApiClientId, tokenName || null);
      setIssuedToken(token);
      await loadApiTokens(selectedApiClientId);
      setApiNotice("APIトークンを発行しました");
    } catch (err) {
      setError(getErrorMessage(err, "APIトークン発行に失敗しました"));
    }
  }

  async function revokeApiToken(tokenId: string) {
    if (!selectedApiClientId) {
      return;
    }
    setError(null);
    setApiNotice(null);
    try {
      await revokeApiClientToken(selectedApiClientId, tokenId);
      await loadApiTokens(selectedApiClientId);
      setApiNotice("APIトークンを失効しました");
    } catch (err) {
      setError(getErrorMessage(err, "APIトークン失効に失敗しました"));
    }
  }

  async function copyIssuedToken() {
    if (!issuedToken?.token) {
      return;
    }
    if (await writeClipboardText(issuedToken.token)) {
      setApiNotice("発行トークンをコピーしました");
    } else {
      setError("クリップボードへのコピーに失敗しました");
    }
  }

  return {
    apiTokens,
    tokenName,
    issuedToken,
    setTokenName,
    setIssuedToken,
    resetApiTokens,
    loadApiTokens,
    createApiToken,
    copyIssuedToken,
    revokeApiToken
  };
}
