import type { GanttScale } from "./appViewTypes";
import { isCurrentGanttUnit } from "./appGanttModel";
import { formatGanttDay, formatGanttMonth, formatGanttWeek } from "./appViewUtils";

type AppGanttDateHeaderProps = {
  ganttScale: GanttScale;
  today: Date;
  unit: Date;
  unitIndex: number;
};

export function AppGanttDateHeader({ ganttScale, today, unit, unitIndex }: AppGanttDateHeaderProps) {
  return (
    <span
      className={`ganttDateHeader ${isCurrentGanttUnit(unit, ganttScale, today) ? "isToday" : ""}`}
      style={{ gridColumn: unitIndex + 2, gridRow: 1 }}
    >
      {ganttScale === "month" ? formatGanttMonth(unit) : ganttScale === "week" ? formatGanttWeek(unit) : formatGanttDay(unit)}
    </span>
  );
}
