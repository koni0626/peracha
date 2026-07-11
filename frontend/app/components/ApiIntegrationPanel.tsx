"use client";

import type { FormEventHandler } from "react";
import type { ApiClient, ApiToken, AuditLog } from "../types";
import { ApiIntegrationHeader } from "./ApiIntegrationHeader";
import { ApiAuditLogPanel, ApiClientCreateForm, ApiClientList, ApiTokenPanel } from "./ApiIntegrationParts";

type ApiIntegrationPanelProps = {
  activeRoomId: string | null;
  apiClients: ApiClient[];
  selectedApiClient: ApiClient | null;
  selectedApiClientId: string | null;
  apiTokens: ApiToken[];
  auditLogs: AuditLog[];
  newApiClientName: string;
  newApiClientType: string;
  tokenName: string;
  issuedToken: ApiToken | null;
  apiNotice: string | null;
  setNewApiClientName: (value: string) => void;
  setNewApiClientType: (value: string) => void;
  setTokenName: (value: string) => void;
  loadApiClients: () => void;
  createApiClient: FormEventHandler<HTMLFormElement>;
  selectApiClient: (clientId: string) => void;
  createApiToken: FormEventHandler<HTMLFormElement>;
  copyIssuedToken: () => void;
  revokeApiToken: (tokenId: string) => void;
  loadAuditLogs: () => void;
};

export function ApiIntegrationPanel({
  activeRoomId,
  apiClients,
  selectedApiClient,
  selectedApiClientId,
  apiTokens,
  auditLogs,
  newApiClientName,
  newApiClientType,
  tokenName,
  issuedToken,
  apiNotice,
  setNewApiClientName,
  setNewApiClientType,
  setTokenName,
  loadApiClients,
  createApiClient,
  selectApiClient,
  createApiToken,
  copyIssuedToken,
  revokeApiToken,
  loadAuditLogs
}: ApiIntegrationPanelProps) {
  return (
    <section>
      <ApiIntegrationHeader activeRoomId={activeRoomId} onLoadApiClients={loadApiClients} />

      <ApiClientCreateForm
        activeRoomId={activeRoomId}
        newApiClientName={newApiClientName}
        newApiClientType={newApiClientType}
        setNewApiClientName={setNewApiClientName}
        setNewApiClientType={setNewApiClientType}
        onSubmit={createApiClient}
      />

      <ApiClientList apiClients={apiClients} selectedApiClientId={selectedApiClientId} onSelect={selectApiClient} />

      {selectedApiClient ? (
        <ApiTokenPanel
          selectedApiClient={selectedApiClient}
          apiTokens={apiTokens}
          tokenName={tokenName}
          issuedToken={issuedToken}
          setTokenName={setTokenName}
          onCreateToken={createApiToken}
          onCopyIssuedToken={copyIssuedToken}
          onRevokeToken={revokeApiToken}
        />
      ) : null}

      <ApiAuditLogPanel
        activeRoomId={activeRoomId}
        auditLogs={auditLogs}
        apiNotice={apiNotice}
        onLoadAuditLogs={loadAuditLogs}
      />
    </section>
  );
}
