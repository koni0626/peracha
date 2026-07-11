"use client";

import type { FormEventHandler } from "react";
import { ShieldCheck } from "lucide-react";

type ApiClientCreateFormProps = {
  activeRoomId: string | null;
  newApiClientName: string;
  newApiClientType: string;
  setNewApiClientName: (value: string) => void;
  setNewApiClientType: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function ApiClientCreateForm({
  activeRoomId,
  newApiClientName,
  newApiClientType,
  setNewApiClientName,
  setNewApiClientType,
  onSubmit
}: ApiClientCreateFormProps) {
  return (
    <form className="apiCreateForm" onSubmit={onSubmit}>
      <input
        value={newApiClientName}
        onChange={(event) => setNewApiClientName(event.target.value)}
        placeholder="クライアント名"
      />
      <select value={newApiClientType} onChange={(event) => setNewApiClientType(event.target.value)}>
        <option value="codex">Codex</option>
        <option value="external_system">外部システム</option>
        <option value="webhook">Webhook</option>
        <option value="other">その他</option>
      </select>
      <button type="submit" disabled={!activeRoomId}>
        <ShieldCheck size={16} />
        作成
      </button>
    </form>
  );
}
