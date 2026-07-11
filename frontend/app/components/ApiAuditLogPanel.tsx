"use client";

import { Activity } from "lucide-react";
import type { AuditLog } from "../types";

type ApiAuditLogPanelProps = {
  activeRoomId: string | null;
  auditLogs: AuditLog[];
  apiNotice: string | null;
  onLoadAuditLogs: () => void;
};

export function ApiAuditLogPanel({ activeRoomId, auditLogs, apiNotice, onLoadAuditLogs }: ApiAuditLogPanelProps) {
  return (
    <>
      <div className="apiAuditHeader">
        <button type="button" onClick={onLoadAuditLogs} disabled={!activeRoomId}>
          <Activity size={16} />
          監査ログ
        </button>
        {apiNotice ? <small>{apiNotice}</small> : null}
      </div>
      {auditLogs.length > 0 ? (
        <div className="auditList">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id}>
              <strong>{log.action}</strong>
              <small>
                {log.method} {log.path}
              </small>
              <time>{new Date(log.created_at).toLocaleString("ja-JP")}</time>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
