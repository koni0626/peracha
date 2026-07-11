import type { WorkTable, WorkTableColumn, WorkTableRecord, WorkTableRecordValue } from "../types";
import { isWorkTableFolderValue } from "../components/workTableValueUtils";

export function splitActiveAndHistoryRecords(records: WorkTableRecord[]) {
  return {
    active: records.filter((record) => !record.parent_record_id),
    histories: records.filter((record) => record.parent_record_id),
  };
}

export function insertActiveRecord(records: WorkTableRecord[], created: WorkTableRecord, insertPosition: number) {
  const { active, histories } = splitActiveAndHistoryRecords(records);
  const nextActive = [...active];
  nextActive.splice(Math.max(0, Math.min(insertPosition - 1, nextActive.length)), 0, created);
  return [...nextActive.map((record, index) => ({ ...record, position: index + 1 })), ...histories];
}

export function mergeActiveRecordOrder(records: WorkTableRecord[], nextActive: WorkTableRecord[]) {
  const { histories } = splitActiveAndHistoryRecords(records);
  return [...nextActive, ...histories];
}

export function replaceRecord(records: WorkTableRecord[], recordId: string, replacement: WorkTableRecord) {
  return records.map((record) => (record.id === recordId ? replacement : record));
}

export function replaceTableRecord(table: WorkTable, recordId: string, replacement: WorkTableRecord) {
  return { ...table, records: replaceRecord(table.records, recordId, replacement) };
}

export function replaceRecordInTables(tables: WorkTable[], tableId: string, recordId: string, replacement: WorkTableRecord) {
  return tables.map((table) => (table.id === tableId ? replaceTableRecord(table, recordId, replacement) : table));
}

export function updateTableRecords(
  tables: WorkTable[],
  tableId: string,
  updateRecords: (records: WorkTableRecord[]) => WorkTableRecord[]
) {
  return tables.map((table) => (table.id === tableId ? { ...table, records: updateRecords(table.records) } : table));
}

export function isSameRecordValue(currentValue: WorkTableRecordValue | null | undefined, nextValue: WorkTableRecordValue) {
  return JSON.stringify(currentValue ?? null) === JSON.stringify(nextValue ?? null);
}

export function recordWithCellValue(record: WorkTableRecord, column: WorkTableColumn, nextValue: WorkTableRecordValue) {
  return { ...record, values: { ...record.values, [column.id]: nextValue } };
}

export function recordCellPatch(column: WorkTableColumn, nextValue: WorkTableRecordValue) {
  return { [column.id]: nextValue };
}

export function workTableCellKey(record: WorkTableRecord, column: WorkTableColumn) {
  return `${record.id}:${column.id}`;
}

export function firstFolderFileId(value: WorkTableRecordValue | undefined) {
  return isWorkTableFolderValue(value) ? value.files[0]?.id ?? null : null;
}

export function recordInsertPosition(
  records: WorkTableRecord[],
  targetRecordId: string,
  side: "above" | "below"
) {
  const index = records.findIndex((item) => item.id === targetRecordId);
  if (index < 0) {
    return null;
  }
  return side === "above" ? index + 1 : index + 2;
}
