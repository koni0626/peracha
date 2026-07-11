import { ChevronLeft, ChevronRight } from "lucide-react";

import { addMonths, formatCalendarMonth, startOfMonth } from "./appViewUtils";

type AppCalendarToolbarProps = {
  calendarMonth: Date;
  setCalendarMonth: (update: Date | ((current: Date) => Date)) => void;
};

export function AppCalendarToolbar({ calendarMonth, setCalendarMonth }: AppCalendarToolbarProps) {
  return (
    <div className="calendarToolbar">
      <div className="calendarNav">
        <button type="button" title="前月" onClick={() => setCalendarMonth((current) => addMonths(current, -1))}>
          <ChevronLeft size={16} />
        </button>
        <button type="button" onClick={() => setCalendarMonth(startOfMonth(new Date()))}>
          今日
        </button>
        <button type="button" title="翌月" onClick={() => setCalendarMonth((current) => addMonths(current, 1))}>
          <ChevronRight size={16} />
        </button>
      </div>
      <h3>{formatCalendarMonth(calendarMonth)}</h3>
    </div>
  );
}
