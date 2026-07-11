"use client";

import type { ApiClient } from "../types";

type ApiClientListProps = {
  apiClients: ApiClient[];
  selectedApiClientId: string | null;
  onSelect: (clientId: string) => void;
};

export function ApiClientList({ apiClients, selectedApiClientId, onSelect }: ApiClientListProps) {
  if (apiClients.length === 0) {
    return (
      <p className="mutedText">
        Codexなどの外部エージェント用に、ルーム単位のAPIトークンを発行できます。
      </p>
    );
  }

  return (
    <div className="apiClientList">
      {apiClients.slice(0, 4).map((client) => (
        <button
          type="button"
          className={client.id === selectedApiClientId ? "active" : ""}
          key={client.id}
          onClick={() => onSelect(client.id)}
        >
          <span>{client.client_type}</span>
          <strong>{client.name}</strong>
          <small>{client.scopes.length} scopes</small>
        </button>
      ))}
    </div>
  );
}
