import type { FormEvent } from "react";

import { DEFAULT_API_SCOPES } from "../constants";
import { createApiClientForRoom } from "./apiIntegrationApi";
import type { ApiClientCreationState } from "./apiClientManagementTypes";
import { prependApiClient } from "./apiClientStateUtils";
import { getErrorMessage } from "./mutationRunner";

export function useApiClientCreator({
  activeRoomId,
  newApiClientName,
  newApiClientType,
  setApiClients,
  setApiNotice,
  setError,
  setSelectedApiClientId,
}: ApiClientCreationState) {
  async function createApiClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeRoomId || !newApiClientName.trim()) {
      return null;
    }
    setError(null);
    setApiNotice(null);
    try {
      const client = await createApiClientForRoom({
        roomId: activeRoomId,
        name: newApiClientName,
        clientType: newApiClientType,
        scopes: DEFAULT_API_SCOPES,
      });
      setApiClients((current) => prependApiClient(current, client));
      setSelectedApiClientId(client.id);
      setApiNotice("APIクライアントを作成しました");
      return client;
    } catch (err) {
      setError(getErrorMessage(err, "APIクライアント作成に失敗しました"));
      return null;
    }
  }

  return { createApiClient };
}
