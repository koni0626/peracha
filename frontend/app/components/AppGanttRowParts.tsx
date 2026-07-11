import { useRef, type CSSProperties } from "react";

import type { WorkTableRecord } from "../types";
import type { GanttScale } from "./appViewTypes";
import { isCurrentGanttUnit } from "./appGanttModel";
import { formatDateInput, formatGanttDay, formatGanttMonth, formatGanttWeek } from "./appViewUtils";

type GanttTaskCellProps = {
  end: Date;
  onOpen: () => void;
  row: number;
  start: Date;
  title: string;
};

type GanttUnitCellProps = {
  ganttScale: GanttScale;
  onOpen: () => void;
  record: WorkTableRecord;
  row: number;
  title: string;
  today: Date;
  unit: Date;
  unitIndex: number;
};

type GanttBarProps = {
  end: Date;
  late: boolean;
  onOpen: () => void;
  onProgressPreview: (progress: number | null) => void;
  onProgressSave?: (progress: number) => void | Promise<void>;
  progress: number;
  progressEditable: boolean;
  start: Date;
  style: CSSProperties;
  title: string;
};

export function GanttTaskCell({ end, onOpen, row, start, title }: GanttTaskCellProps) {
  return (
    <button type="button" className="ganttTaskCell" style={{ gridColumn: 1, gridRow: row }} onClick={onOpen}>
      <strong>{title}</strong>
      <span>
        {formatDateInput(start)} - {formatDateInput(end)}
      </span>
    </button>
  );
}

export function GanttUnitCell({ ganttScale, onOpen, record, row, title, today, unit, unitIndex }: GanttUnitCellProps) {
  return (
    <button
      type="button"
      className={`ganttUnitCell ${isCurrentGanttUnit(unit, ganttScale, today) ? "isToday" : ""}`}
      key={`${record.id}-${unit.toISOString()}`}
      style={{ gridColumn: unitIndex + 2, gridRow: row }}
      onClick={onOpen}
      aria-label={`${title} ${ganttScale === "month" ? formatGanttMonth(unit) : ganttScale === "week" ? formatGanttWeek(unit) : formatGanttDay(unit)}`}
    />
  );
}

function progressFromPointer(event: PointerEvent | React.PointerEvent<HTMLElement>, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(((event.clientX - rect.left) / rect.width) * 100)));
}

export function GanttBar({
  end,
  late,
  onOpen,
  onProgressPreview,
  onProgressSave,
  progress,
  progressEditable,
  start,
  style,
  title,
}: GanttBarProps) {
  const suppressClickRef = useRef(false);

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (!progressEditable || event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget;
    let moved = false;
    const preview = (pointerEvent: PointerEvent | React.PointerEvent<HTMLButtonElement>) => {
      const nextProgress = progressFromPointer(pointerEvent, target);
      moved = moved || nextProgress !== progress;
      onProgressPreview(nextProgress);
      return nextProgress;
    };
    preview(event);
    target.setPointerCapture(event.pointerId);

    const handlePointerMove = (pointerEvent: PointerEvent) => {
      preview(pointerEvent);
    };
    const handlePointerUp = (pointerEvent: PointerEvent) => {
      const nextProgress = preview(pointerEvent);
      onProgressPreview(null);
      target.releasePointerCapture(event.pointerId);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerup", handlePointerUp);
      target.removeEventListener("pointercancel", handlePointerCancel);
      if (moved || nextProgress !== progress) {
        suppressClickRef.current = true;
        onProgressSave?.(nextProgress);
      }
    };
    const handlePointerCancel = () => {
      onProgressPreview(null);
      target.releasePointerCapture(event.pointerId);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerup", handlePointerUp);
      target.removeEventListener("pointercancel", handlePointerCancel);
    };

    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerup", handlePointerUp);
    target.addEventListener("pointercancel", handlePointerCancel);
  }

  function handleClick() {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onOpen();
  }

  return (
    <button
      type="button"
      className={`ganttBar ${late ? "isLate" : "isOk"} ${progressEditable ? "isEditable" : ""}`}
      style={style}
      title={`${title}: ${formatDateInput(start)} - ${formatDateInput(end)} / ${progress}%`}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
    >
      <span className="ganttBarFill" />
      <span className="ganttBarRest" />
      <span className="ganttBarLabel">{progress}%</span>
      {late ? "遅延" : "OK"}
    </button>
  );
}
