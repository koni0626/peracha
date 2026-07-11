"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { useApiAuditLogs } from "./useApiAuditLogs";
import { useApiClientManagement } from "./useApiClientManagement";
import { useApiTokenManagement } from "./useApiTokenManagement";
import { getErrorMessage } from "./mutationRunner";

type UseApiIntegrationOptions = {
  activeRoomId: string | null;
  setError: (message: string | null) => void;
};

export function useApiIntegration({ activeRoomId, setError }: UseApiIntegrationOptions) {
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const clientManagement = useApiClientManagement({ activeRoomId, setApiNotice, setError });
  const tokenManagement = useApiTokenManagement({
    selectedApiClientId: clientManagement.selectedApiClientId,
    setApiNotice,
    setError,
  });
  const auditLogManagement = useApiAuditLogs({ activeRoomId, setApiNotice, setError });

  useEffect(() => {
    clientManagement.resetApiClients();
    tokenManagement.resetApiTokens();
    auditLogManagement.resetAuditLogs();
    setApiNotice(null);
  }, [activeRoomId]);

  async function loadApiClients() {
    const nextClientId = await clientManagement.loadApiClients();
    if (nextClientId) {
      await tokenManagement.loadApiTokens(nextClientId);
    } else {
      tokenManagement.resetApiTokens();
    }
  }

  async function createApiClient(event: FormEvent<HTMLFormElement>) {
    const client = await clientManagement.createApiClient(event);
    if (client) {
      tokenManagement.resetApiTokens();
    }
  }

  async function selectApiClient(clientId: string) {
    clientManagement.selectApiClient(clientId);
    try {
      tokenManagement.setIssuedToken(null);
      await tokenManagement.loadApiTokens(clientId);
    } catch (err) {
      setError(getErrorMessage(err, "APIトークンの取得に失敗しました"));
    }
  }

  return {
    apiClients: clientManagement.apiClients,
    selectedApiClient: clientManagement.selectedApiClient,
    selectedApiClientId: clientManagement.selectedApiClientId,
    apiTokens: tokenManagement.apiTokens,
    auditLogs: auditLogManagement.auditLogs,
    newApiClientName: clientManagement.newApiClientName,
    newApiClientType: clientManagement.newApiClientType,
    tokenName: tokenManagement.tokenName,
    issuedToken: tokenManagement.issuedToken,
    apiNotice,
    setNewApiClientName: clientManagement.setNewApiClientName,
    setNewApiClientType: clientManagement.setNewApiClientType,
    setTokenName: tokenManagement.setTokenName,
    loadApiClients,
    createApiClient,
    selectApiClient,
    createApiToken: tokenManagement.createApiToken,
    copyIssuedToken: tokenManagement.copyIssuedToken,
    revokeApiToken: tokenManagement.revokeApiToken,
    loadAuditLogs: auditLogManagement.loadAuditLogs,
  };
}
