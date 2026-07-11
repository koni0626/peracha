"use client";

import { apiFetch } from "../api";
import type { ApiClient, ApiToken, AuditLog, Page } from "../types";

type CreateApiClientInput = {
  roomId: string;
  name: string;
  clientType: string;
  scopes: string[];
};

export function fetchApiClients(roomId: string) {
  return apiFetch<Page<ApiClient>>(`/api/api-clients?room_id=${roomId}`);
}

export function createApiClientForRoom({ roomId, name, clientType, scopes }: CreateApiClientInput) {
  return apiFetch<ApiClient>("/api/api-clients", {
    method: "POST",
    body: JSON.stringify({
      room_id: roomId,
      name,
      client_type: clientType,
      scopes,
      active: true
    })
  });
}

export function fetchApiTokens(clientId: string) {
  return apiFetch<Page<ApiToken>>(`/api/api-clients/${clientId}/tokens`);
}

export function createApiTokenForClient(clientId: string, name: string | null) {
  return apiFetch<ApiToken>(`/api/api-clients/${clientId}/tokens`, {
    method: "POST",
    body: JSON.stringify({ name })
  });
}

export function revokeApiClientToken(clientId: string, tokenId: string) {
  return apiFetch<ApiToken>(`/api/api-clients/${clientId}/tokens/${tokenId}`, {
    method: "DELETE"
  });
}

export function fetchAuditLogsForRoom(roomId: string) {
  return apiFetch<Page<AuditLog>>(`/api/audit-logs?room_id=${roomId}`);
}
