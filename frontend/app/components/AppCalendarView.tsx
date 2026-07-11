import type { WorkTableColumn, WorkTableRecord, WorkTableRecordValue } from "../types";
import { AppCalendarCell } from "./AppCalendarCell";
import { AppCalendarToolbar } from "./AppCalendarToolbar";
import { calendarMonthDays, calendarWeekLabels, groupCalendarEvents, isInCalendarMonth } from "./appCalendarModel";
import { formatDateInput, sameDay, startOfDay } from "./appViewUtils";

type AppCalendarViewProps = {
  calendarMonth: Date;
  endDateColumn: WorkTableColumn | null;
  onCreateRecord: (values: Record<string, WorkTableRecordValue>) => void;
  onOpenRecord: (record: WorkTableRecord) => void;
  records: WorkTableRecord[];
  recordTitle: (record: WorkTableRecord) => string;
  setCalendarMonth: (update: Date | ((current: Date) => Date)) => void;
  startDateColumn: WorkTableColumn | null;
};

export function AppCalendarView({
  calendarMonth,
  endDateColumn,
  onCreateRecord,
  onOpenRecord,
  records,
  recordTitle,
  setCalendarMonth,
  startDateColumn,
}: AppCalendarViewProps) {
  const createDateColumn = startDateColumn ?? endDateColumn;
  if (!createDateColumn) {
    return <p className="appViewEmpty">カレンダーに使う開始日または終了日を指定してください。</p>;
  }

  const grouped = groupCalendarEvents({ endDateColumn, records, startDateColumn });
  const days = calendarMonthDays(calendarMonth);
  const today = startOfDay(new Date());

  return (
    <div className="calendarMonthView">
      <AppCalendarToolbar calendarMonth={calendarMonth} setCalendarMonth={setCalendarMonth} />
      <div className="calendarGrid">
        {calendarWeekLabels.map((label) => (
          <div className="calendarWeekday" key={label}>
            {label}
          </div>
        ))}
        {days.map((day) => {
          const key = formatDateInput(day);
          const dayEvents = grouped[key] ?? [];
          const inCurrentMonth = isInCalendarMonth(day, calendarMonth);
          return (
            <AppCalendarCell
              day={day}
              dayEvents={dayEvents}
              inCurrentMonth={inCurrentMonth}
              isToday={sameDay(day, today)}
              key={key}
              onCreateRecord={(targetDay) => onCreateRecord({ [createDateColumn.id]: formatDateInput(targetDay) })}
              onOpenRecord={onOpenRecord}
              recordTitle={recordTitle}
            />
          );
        })}
      </div>
    </div>
  );
}
