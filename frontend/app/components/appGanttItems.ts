import type { WorkTableColumn, WorkTableRecord } from "../types";
import { parseDateValue, parseProgressPercent } from "./appViewUtils";

export type GanttItem = {
  end: Date;
  progress: number;
  record: WorkTableRecord;
  start: Date;
};

type GanttItemColumns = {
  endDateColumn: WorkTableColumn | null;
  progressColumn: WorkTableColumn | null;
  startDateColumn: WorkTableColumn | null;
};

export function ganttItemFromRecord(record: WorkTableRecord, columns: GanttItemColumns) {
  const start = parseDateValue(columns.startDateColumn ? record.values[columns.startDateColumn.id] : undefined);
  const end = parseDateValue(columns.endDateColumn ? record.values[columns.endDateColumn.id] : undefined) ?? start;
  const progress = parseProgressPercent(columns.progressColumn ? record.values[columns.progressColumn.id] : undefined);
  return start && end ? { record, start, end, progress } : null;
}
