import type { WorkTableColumn, WorkTableRecord } from "../types";
import { addDays, formatDateInput, parseDateValue, startOfMonth, startOfWeek } from "./appViewUtils";

export type CalendarRecordEvent = {
  kind: "start" | "end";
  record: WorkTableRecord;
};

type GroupCalendarEventsOptions = {
  endDateColumn: WorkTableColumn | null;
  records: WorkTableRecord[];
  startDateColumn: WorkTableColumn | null;
};

function pushCalendarEvent(
  acc: Record<string, CalendarRecordEvent[]>,
  record: WorkTableRecord,
  column: WorkTableColumn | null,
  kind: CalendarRecordEvent["kind"],
) {
  if (!column) {
    return;
  }
  const date = parseDateValue(record.values[column.id]);
  if (!date) {
    return;
  }
  const key = formatDateInput(date);
  acc[key] = [...(acc[key] ?? []), { kind, record }];
}

export function groupCalendarEvents({ endDateColumn, records, startDateColumn }: GroupCalendarEventsOptions) {
  return records.reduce<Record<string, CalendarRecordEvent[]>>((acc, record) => {
    pushCalendarEvent(acc, record, startDateColumn, "start");
    pushCalendarEvent(acc, record, endDateColumn, "end");
    return acc;
  }, {});
}

export function calendarMonthDays(calendarMonth: Date) {
  const gridStart = startOfWeek(startOfMonth(calendarMonth));
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

export function isInCalendarMonth(day: Date, calendarMonth: Date) {
  return day.getMonth() === calendarMonth.getMonth() && day.getFullYear() === calendarMonth.getFullYear();
}

export const calendarWeekLabels = ["日", "月", "火", "水", "木", "金", "土"];
