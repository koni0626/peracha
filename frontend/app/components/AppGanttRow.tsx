import { Fragment, useState, type CSSProperties } from "react";

import type { WorkTableRecord } from "../types";
import type { GanttScale } from "./appViewTypes";
import type { GanttItem } from "./appGanttModel";
import {
  ganttUnitDuration,
  ganttUnitStartIndex,
} from "./appGanttModel";
import { startOfDay } from "./appViewUtils";
import { GanttBar, GanttTaskCell, GanttUnitCell } from "./AppGanttRowParts";

type AppGanttRowProps = {
  item: GanttItem;
  itemIndex: number;
  ganttScale: GanttScale;
  timelineStart: Date;
  today: Date;
  units: Date[];
  onOpenRecord: (record: WorkTableRecord) => void;
  onUpdateProgress?: (record: WorkTableRecord, progress: number) => void | Promise<void>;
  recordTitle: (record: WorkTableRecord) => string;
};

export function AppGanttRow({
  item,
  itemIndex,
  ganttScale,
  timelineStart,
  today,
  units,
  onOpenRecord,
  onUpdateProgress,
  recordTitle,
}: AppGanttRowProps) {
  const { record, start, end, progress } = item;
  const [dragProgress, setDragProgress] = useState<number | null>(null);
  const displayProgress = dragProgress ?? progress;
  const title = recordTitle(record);
  const late = startOfDay(end).getTime() < today.getTime();
  const startIndex = ganttUnitStartIndex(start, ganttScale, timelineStart);
  const duration = ganttUnitDuration(start, end, ganttScale);
  const row = itemIndex + 2;
  const barStyle = {
    gridColumn: `${startIndex + 2} / span ${duration}`,
    gridRow: row,
    "--progress": `${displayProgress}%`,
  } as CSSProperties;

  return (
    <Fragment>
      <GanttTaskCell
        end={end}
        onOpen={() => onOpenRecord(record)}
        row={row}
        start={start}
        title={title}
      />
      {units.map((unit, unitIndex) => (
        <GanttUnitCell
          ganttScale={ganttScale}
          key={`${record.id}-${unit.toISOString()}`}
          onOpen={() => onOpenRecord(record)}
          record={record}
          row={row}
          title={title}
          today={today}
          unit={unit}
          unitIndex={unitIndex}
        />
      ))}
      <GanttBar
        end={end}
        late={late}
        onOpen={() => onOpenRecord(record)}
        onProgressPreview={setDragProgress}
        onProgressSave={(nextProgress) => onUpdateProgress?.(record, nextProgress)}
        progress={displayProgress}
        progressEditable={Boolean(onUpdateProgress)}
        start={start}
        style={barStyle}
        title={title}
      />
    </Fragment>
  );
}
