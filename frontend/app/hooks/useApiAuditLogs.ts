"use client";

import { useState } from "react";

import type { AuditLog } from "../types";
import { fetchAuditLogsForRoom } from "./apiIntegrationApi";
import { getErrorMessage } from "./mutationRunner";

type UseApiAuditLogsOptions = {
  activeRoomId: string | null;
  setApiNotice: (message: string | null) => void;
  setError: (message: string | null) => void;
};

export function useApiAuditLogs({ activeRoomId, setApiNotice, setError }: UseApiAuditLogsOptions) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  function resetAuditLogs() {
    setAuditLogs([]);
  }

  async function loadAuditLogs() {
    if (!activeRoomId) {
      return;
    }
    setError(null);
    setApiNotice(null);
    try {
      const data = await fetchAuditLogsForRoom(activeRoomId);
      setAuditLogs(data.items);
    } catch (err) {
      setError(getErrorMessage(err, "監査ログの取得に失敗しました"));
    }
  }

  return {
    auditLogs,
    resetAuditLogs,
    loadAuditLogs
  };
}
