import type { BarChart3 } from "lucide-react";

export type ViewKind = "gantt" | "kanban" | "calendar";
export type GanttScale = "day" | "week" | "month";

export type AppViewOption = {
  kind: ViewKind;
  label: string;
  icon: typeof BarChart3;
};
