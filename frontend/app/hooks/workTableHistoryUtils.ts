import type { WorkTable } from "../types";

export function sortedRecordHistories(activeTable: WorkTable | null, recordId: string) {
  if (!activeTable) {
    return [];
  }
  return activeTable.records
    .filter((record) => record.parent_record_id === recordId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function formatHistoryTime(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
