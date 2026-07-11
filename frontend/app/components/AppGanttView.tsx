import type { WorkTableColumn, WorkTableRecord } from "../types";
import type { GanttScale } from "./appViewTypes";
import { AppGanttDateHeader } from "./AppGanttDateHeader";
import { AppGanttRow } from "./AppGanttRow";
import { ganttItems, ganttTimeline } from "./appGanttModel";
import { startOfDay } from "./appViewUtils";

type AppGanttViewProps = {
  endDateColumn: WorkTableColumn | null;
  ganttScale: GanttScale;
  progressColumn: WorkTableColumn | null;
  records: WorkTableRecord[];
  startDateColumn: WorkTableColumn | null;
  onOpenRecord: (record: WorkTableRecord) => void;
  onUpdateProgress: (record: WorkTableRecord, progress: number) => void | Promise<void>;
  recordTitle: (record: WorkTableRecord) => string;
};

export function AppGanttView({
  endDateColumn,
  ganttScale,
  progressColumn,
  records,
  startDateColumn,
  onOpenRecord,
  onUpdateProgress,
  recordTitle,
}: AppGanttViewProps) {
  const items = ganttItems({ endDateColumn, progressColumn, records, startDateColumn });

  if (items.length === 0) {
    return <p className="appViewEmpty">日付が入ったレコードがありません。</p>;
  }

  const today = startOfDay(new Date());
  const { timelineStart, units } = ganttTimeline(items, ganttScale, today);
  const unitColumnWidth = ganttScale === "month" ? "92px" : ganttScale === "week" ? "68px" : "42px";
  const gridTemplateColumns = `260px repeat(${units.length}, ${unitColumnWidth})`;

  return (
    <div className={`ganttView is${ganttScale[0].toUpperCase()}${ganttScale.slice(1)}Scale`}>
      <div className="ganttGrid" style={{ gridTemplateColumns }}>
        <strong className="ganttTaskHeader">タスク</strong>
        {units.map((unit, unitIndex) => (
          <AppGanttDateHeader
            ganttScale={ganttScale}
            key={unit.toISOString()}
            today={today}
            unit={unit}
            unitIndex={unitIndex}
          />
        ))}
        {items.map((item, itemIndex) => (
          <AppGanttRow
            ganttScale={ganttScale}
            item={item}
            itemIndex={itemIndex}
            key={item.record.id}
            timelineStart={timelineStart}
            today={today}
            units={units}
            onOpenRecord={onOpenRecord}
            onUpdateProgress={progressColumn ? onUpdateProgress : undefined}
            recordTitle={recordTitle}
          />
        ))}
      </div>
    </div>
  );
}
