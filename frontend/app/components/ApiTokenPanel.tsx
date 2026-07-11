"use client";

import type { FormEventHandler } from "react";
import { Ban } from "lucide-react";
import type { ApiClient, ApiToken } from "../types";
import { ApiScopesBlock, ApiTokenCreateForm, IssuedTokenBox } from "./ApiTokenPanelParts";

type ApiTokenPanelProps = {
  selectedApiClient: ApiClient;
  apiTokens: ApiToken[];
  tokenName: string;
  issuedToken: ApiToken | null;
  setTokenName: (value: string) => void;
  onCreateToken: FormEventHandler<HTMLFormElement>;
  onCopyIssuedToken: () => void;
  onRevokeToken: (tokenId: string) => void;
};

export function ApiTokenPanel({
  selectedApiClient,
  apiTokens,
  tokenName,
  issuedToken,
  setTokenName,
  onCreateToken,
  onCopyIssuedToken,
  onRevokeToken
}: ApiTokenPanelProps) {
  return (
    <div className="apiTokenPanel">
      <ApiScopesBlock selectedApiClient={selectedApiClient} />
      <ApiTokenCreateForm tokenName={tokenName} setTokenName={setTokenName} onCreateToken={onCreateToken} />
      <IssuedTokenBox issuedToken={issuedToken} onCopyIssuedToken={onCopyIssuedToken} />
      <ApiTokenList apiTokens={apiTokens} onRevokeToken={onRevokeToken} />
    </div>
  );
}

function ApiTokenList({ apiTokens, onRevokeToken }: Pick<ApiTokenPanelProps, "apiTokens" | "onRevokeToken">) {
  if (apiTokens.length === 0) {
    return null;
  }

  return (
    <div className="apiTokenList">
      {apiTokens.slice(0, 5).map((token) => (
        <div className={token.revoked_at ? "revoked" : ""} key={token.id}>
          <span>{token.name ?? "unnamed"}</span>
          <small>{formatTokenStatus(token)}</small>
          <button type="button" onClick={() => onRevokeToken(token.id)} disabled={Boolean(token.revoked_at)} title="失効">
            <Ban size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

function formatTokenStatus(token: ApiToken) {
  if (token.revoked_at) {
    return "失効済み";
  }
  if (token.last_used_at) {
    return `最終利用 ${new Date(token.last_used_at).toLocaleString("ja-JP")}`;
  }
  return "未使用";
}
