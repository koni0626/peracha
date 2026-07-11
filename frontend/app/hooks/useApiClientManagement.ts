"use client";

import { useMemo, useState } from "react";

import type { ApiClient } from "../types";
import type { ApiClientManagementOptions } from "./apiClientManagementTypes";
import { useApiClientCreator } from "./useApiClientCreator";
import { useApiClientLoader } from "./useApiClientLoader";

export function useApiClientManagement({ activeRoomId, setApiNotice, setError }: ApiClientManagementOptions) {
  const [apiClients, setApiClients] = useState<ApiClient[]>([]);
  const [selectedApiClientId, setSelectedApiClientId] = useState<string | null>(null);
  const [newApiClientName, setNewApiClientName] = useState("Codex");
  const [newApiClientType, setNewApiClientType] = useState("codex");

  const selectedApiClient = useMemo(
    () => apiClients.find((client) => client.id === selectedApiClientId) ?? null,
    [apiClients, selectedApiClientId],
  );

  function resetApiClients() {
    setApiClients([]);
    setSelectedApiClientId(null);
  }

  const { loadApiClients } = useApiClientLoader({
    activeRoomId,
    selectedApiClientId,
    setApiClients,
    setApiNotice,
    setError,
    setSelectedApiClientId,
  });
  const { createApiClient } = useApiClientCreator({
    activeRoomId,
    newApiClientName,
    newApiClientType,
    selectedApiClientId,
    setApiClients,
    setApiNotice,
    setError,
    setSelectedApiClientId,
  });

  function selectApiClient(clientId: string) {
    setSelectedApiClientId(clientId);
    setApiNotice(null);
  }

  return {
    apiClients,
    selectedApiClient,
    selectedApiClientId,
    newApiClientName,
    newApiClientType,
    setNewApiClientName,
    setNewApiClientType,
    resetApiClients,
    loadApiClients,
    createApiClient,
    selectApiClient,
  };
}
