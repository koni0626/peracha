import type { WorkTable, WorkTableColumn, WorkTableRecord, WorkTableRecordValue } from "../types";

export function valueText(value: WorkTableRecordValue | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

export function parseProgressPercent(value: WorkTableRecordValue | undefined) {
  const text = valueText(value).trim();
  if (!text) {
    return 0;
  }
  const normalized = text.replace("％", "%").replace("%", "");
  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  if (!match) {
    return 0;
  }
  const parsed = Number(match[0]);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round(parsed)));
}

export function activeRecords(table: WorkTable | null) {
  return table?.records.filter((record) => !record.parent_record_id) ?? [];
}

export function selectedWorkTable(tables: WorkTable[], selectedTableId: string | null) {
  return tables.find((table) => table.id === selectedTableId) ?? tables[0] ?? null;
}

export function appRecordTitle(record: WorkTableRecord, titleColumn: WorkTableColumn | null) {
  return valueText(titleColumn ? record.values[titleColumn.id] : undefined) || "無題";
}
