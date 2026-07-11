import type { WorkTableRecordValue } from "../types";

import { valueText } from "./appRecordUtils";

export function parseDateValue(value: WorkTableRecordValue | undefined) {
  const text = valueText(value);
  if (!text) {
    return null;
  }
  const date = new Date(`${text}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysBetween(start: Date, end: Date) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.max(0, Math.round((endUtc - startUtc) / msPerDay));
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(date: Date, months: number) {
  const next = new Date(date.getFullYear(), date.getMonth(), 1);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function startOfWeek(date: Date) {
  return addDays(startOfDay(date), -date.getDay());
}

export function addWeeks(date: Date, weeks: number) {
  return addDays(startOfWeek(date), weeks * 7);
}

export function weeksBetween(start: Date, end: Date) {
  return Math.max(0, Math.floor(daysBetween(startOfWeek(start), startOfWeek(end)) / 7));
}

export function monthsBetween(start: Date, end: Date) {
  return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth());
}

export function sameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

export function sameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function sameWeek(left: Date, right: Date) {
  return sameDay(startOfWeek(left), startOfWeek(right));
}

export function formatGanttDay(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function formatGanttWeek(date: Date) {
  const weekStart = startOfWeek(date);
  return `${weekStart.getMonth() + 1}/${weekStart.getDate()}週`;
}

export function formatGanttMonth(date: Date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}`;
}

export function formatCalendarMonth(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}
