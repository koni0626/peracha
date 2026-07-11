import type { KeyboardEvent } from "react";

import type { WorkTableRecord } from "../types";
import type { CalendarRecordEvent } from "./appCalendarModel";

type AppCalendarCellProps = {
  day: Date;
  dayEvents: CalendarRecordEvent[];
  inCurrentMonth: boolean;
  isToday: boolean;
  onCreateRecord: (day: Date) => void;
  onOpenRecord: (record: WorkTableRecord) => void;
  recordTitle: (record: WorkTableRecord) => string;
};

export function AppCalendarCell({
  day,
  dayEvents,
  inCurrentMonth,
  isToday,
  onCreateRecord,
  onOpenRecord,
  recordTitle,
}: AppCalendarCellProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onCreateRecord(day);
    }
  }

  return (
    <section
      className={`calendarCell ${inCurrentMonth ? "" : "isOutsideMonth"} ${isToday ? "isToday" : ""}`}
      role="button"
      tabIndex={0}
      title={`${day.getFullYear()}/${day.getMonth() + 1}/${day.getDate()} に追加`}
      onClick={() => onCreateRecord(day)}
      onKeyDown={handleKeyDown}
    >
      <div className="calendarDateNumber">{day.getDate()}</div>
      <div className="calendarEvents">
        {dayEvents.map((item) => (
          <button
            className={`calendarEvent is${item.kind === "start" ? "Start" : "End"}`}
            key={`${item.record.id}-${item.kind}`}
            title={recordTitle(item.record)}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenRecord(item.record);
            }}
          >
            <span className="calendarEventKind">{item.kind === "start" ? "開始" : "終了"}</span>
            <span className="calendarEventTitle">{recordTitle(item.record)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
