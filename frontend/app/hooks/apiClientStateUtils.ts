import type { ApiClient } from "../types";
import { pickCurrentOrFirstId, prependUniqueById } from "./idListUtils";

export function pickSelectedClientId(clients: ApiClient[], currentClientId: string | null) {
  return pickCurrentOrFirstId(clients, currentClientId);
}

export function prependApiClient(clients: ApiClient[], client: ApiClient) {
  return prependUniqueById(clients, client, clients.length + 1);
}
