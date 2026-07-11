import { fetchApiClients } from "./apiIntegrationApi";
import { pickSelectedClientId } from "./apiClientStateUtils";
import type { ApiClientMutationState } from "./apiClientManagementTypes";
import { getErrorMessage } from "./mutationRunner";

export function useApiClientLoader({
  activeRoomId,
  selectedApiClientId,
  setApiClients,
  setApiNotice,
  setError,
  setSelectedApiClientId,
}: ApiClientMutationState) {
  async function loadApiClients() {
    if (!activeRoomId) {
      return null;
    }
    setError(null);
    setApiNotice(null);
    try {
      const data = await fetchApiClients(activeRoomId);
      const nextClientId = pickSelectedClientId(data.items, selectedApiClientId);
      setApiClients(data.items);
      setSelectedApiClientId(nextClientId);
      return nextClientId;
    } catch (err) {
      setError(getErrorMessage(err, "APIクライアントの取得に失敗しました"));
      return null;
    }
  }

  return { loadApiClients };
}
