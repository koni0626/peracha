import type { WorkTableColumn, WorkTableRecord } from "../types";
import { ganttItemFromRecord, type GanttItem } from "./appGanttItems";
import type { GanttScale } from "./appViewTypes";
import {
  addDays,
  addMonths,
  addWeeks,
  daysBetween,
  monthsBetween,
  sameDay,
  sameMonth,
  sameWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  weeksBetween,
} from "./appViewUtils";

export type { GanttItem };

export function ganttItems({
  endDateColumn,
  progressColumn,
  records,
  startDateColumn,
}: {
  endDateColumn: WorkTableColumn | null;
  progressColumn: WorkTableColumn | null;
  records: WorkTableRecord[];
  startDateColumn: WorkTableColumn | null;
}) {
  return records
    .map((record) => ganttItemFromRecord(record, { endDateColumn, progressColumn, startDateColumn }))
    .filter((item): item is GanttItem => Boolean(item));
}

export function ganttTimeline(items: GanttItem[], scale: GanttScale, today: Date) {
  const minDate = startOfDay(new Date(Math.min(...items.map((item) => item.start.getTime()), today.getTime())));
  const maxDate = startOfDay(new Date(Math.max(...items.map((item) => item.end.getTime()), today.getTime())));
  const timelineStart = scale === "month" ? startOfMonth(minDate) : scale === "week" ? startOfWeek(minDate) : minDate;
  const timelineEnd = scale === "month" ? startOfMonth(maxDate) : scale === "week" ? startOfWeek(maxDate) : maxDate;
  const units = Array.from({ length: ganttUnitCount(timelineStart, timelineEnd, scale) }, (_, index) =>
    scale === "month" ? addMonths(timelineStart, index) : scale === "week" ? addWeeks(timelineStart, index) : addDays(timelineStart, index)
  );

  return {
    timelineStart,
    units,
  };
}

export function ganttUnitStartIndex(date: Date, scale: GanttScale, timelineStart: Date) {
  if (scale === "month") {
    return monthsBetween(timelineStart, startOfMonth(date));
  }
  if (scale === "week") {
    return weeksBetween(timelineStart, startOfWeek(date));
  }
  return daysBetween(timelineStart, startOfDay(date));
}

export function ganttUnitDuration(start: Date, end: Date, scale: GanttScale) {
  if (scale === "month") {
    return Math.max(1, monthsBetween(startOfMonth(start), startOfMonth(end)) + 1);
  }
  if (scale === "week") {
    return Math.max(1, weeksBetween(startOfWeek(start), startOfWeek(end)) + 1);
  }
  return Math.max(1, daysBetween(startOfDay(start), startOfDay(end)) + 1);
}

export function isCurrentGanttUnit(unit: Date, scale: GanttScale, today: Date) {
  return scale === "month" ? sameMonth(unit, today) : scale === "week" ? sameWeek(unit, today) : sameDay(unit, today);
}

function ganttUnitCount(timelineStart: Date, timelineEnd: Date, scale: GanttScale) {
  if (scale === "month") {
    return monthsBetween(timelineStart, timelineEnd) + 1;
  }
  if (scale === "week") {
    return weeksBetween(timelineStart, timelineEnd) + 1;
  }
  return daysBetween(timelineStart, timelineEnd) + 1;
}
