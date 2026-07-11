import type { FormEventHandler } from "react";
import { ClipboardCopy, KeyRound } from "lucide-react";

import type { ApiClient, ApiToken } from "../types";

type ApiScopesBlockProps = {
  selectedApiClient: ApiClient;
};

type ApiTokenCreateFormProps = {
  tokenName: string;
  setTokenName: (value: string) => void;
  onCreateToken: FormEventHandler<HTMLFormElement>;
};

type IssuedTokenBoxProps = {
  issuedToken: ApiToken | null;
  onCopyIssuedToken: () => void;
};

export function ApiScopesBlock({ selectedApiClient }: ApiScopesBlockProps) {
  return (
    <div className="miniBlock">
      <strong>権限</strong>
      <ul>
        {selectedApiClient.scopes.map((scope) => (
          <li key={scope}>{scope}</li>
        ))}
      </ul>
    </div>
  );
}

export function ApiTokenCreateForm({ tokenName, setTokenName, onCreateToken }: ApiTokenCreateFormProps) {
  return (
    <form className="apiCreateForm" onSubmit={onCreateToken}>
      <input value={tokenName} onChange={(event) => setTokenName(event.target.value)} placeholder="トークン名" />
      <button type="submit">
        <KeyRound size={16} />
        発行
      </button>
    </form>
  );
}

export function IssuedTokenBox({ issuedToken, onCopyIssuedToken }: IssuedTokenBoxProps) {
  if (!issuedToken?.token) {
    return null;
  }

  return (
    <div className="tokenBox">
      <strong>発行トークン</strong>
      <code>{issuedToken.token}</code>
      <button type="button" onClick={onCopyIssuedToken}>
        <ClipboardCopy size={16} />
        コピー
      </button>
    </div>
  );
}
