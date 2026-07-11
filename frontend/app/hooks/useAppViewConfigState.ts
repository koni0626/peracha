import { useCallback, useState } from "react";

import type { GanttScale, ViewKind } from "../components/appViewTypes";
import { startOfMonth } from "../components/appViewUtils";

export function useAppViewConfigState() {
  const [selectedKind, setSelectedKind] = useState<ViewKind>("gantt");
  const [titleColumnId, setTitleColumnId] = useState("");
  const [statusColumnId, setStatusColumnId] = useState("");
  const [startDateColumnId, setStartDateColumnId] = useState("");
  const [endDateColumnId, setEndDateColumnId] = useState("");
  const [progressColumnId, setProgressColumnId] = useState("");
  const [ganttScale, setGanttScale] = useState<GanttScale>("day");
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));

  const resetColumnSelection = useCallback(() => {
    setTitleColumnId("");
    setStatusColumnId("");
    setStartDateColumnId("");
    setEndDateColumnId("");
    setProgressColumnId("");
  }, []);

  return {
    calendarMonth,
    endDateColumnId,
    ganttScale,
    progressColumnId,
    selectedKind,
    startDateColumnId,
    statusColumnId,
    titleColumnId,
    resetColumnSelection,
    setCalendarMonth,
    setEndDateColumnId,
    setGanttScale,
    setProgressColumnId,
    setSelectedKind,
    setStartDateColumnId,
    setStatusColumnId,
    setTitleColumnId,
  };
}
