import { BarChart3, CalendarDays, Columns3 } from "lucide-react";

import type { AppViewOption, ViewKind } from "./appViewTypes";

export const APP_VIEW_OPTIONS: AppViewOption[] = [
  { kind: "gantt", label: "ガントチャート", icon: BarChart3 },
  { kind: "kanban", label: "カンバン", icon: Columns3 },
  { kind: "calendar", label: "カレンダー", icon: CalendarDays },
];

export function appViewLabel(kind: ViewKind) {
  return APP_VIEW_OPTIONS.find((option) => option.kind === kind)?.label ?? "";
}
