import { useEffect } from "react";

import type { WorkTable, WorkTableColumn, WorkTableRecord } from "../types";
import { parseDateValue, startOfMonth } from "../components/appViewUtils";
import type { useAppViewConfigState } from "./useAppViewConfigState";

type AppViewConfigState = ReturnType<typeof useAppViewConfigState>;

type UseAppViewSelectionEffectsOptions = {
  config: AppViewConfigState;
  dateColumns: WorkTableColumn[];
  defaultProgressColumn: WorkTableColumn | null;
  endDateColumn: WorkTableColumn | null;
  records: WorkTableRecord[];
  selectColumns: WorkTableColumn[];
  selectedTable: WorkTable | null;
  startDateColumn: WorkTableColumn | null;
  textColumns: WorkTableColumn[];
};

function hasColumn(table: WorkTable, columnId: string) {
  return table.columns.some((column) => column.id === columnId);
}

export function useAppViewSelectionEffects({
  config,
  dateColumns,
  defaultProgressColumn,
  endDateColumn,
  records,
  selectColumns,
  selectedTable,
  startDateColumn,
  textColumns,
}: UseAppViewSelectionEffectsOptions) {
  const {
    resetColumnSelection,
    setCalendarMonth,
    setEndDateColumnId,
    setProgressColumnId,
    setStartDateColumnId,
    setStatusColumnId,
    setTitleColumnId,
  } = config;

  useEffect(() => {
    if (!selectedTable) {
      resetColumnSelection();
      return;
    }

    setTitleColumnId((current) => (hasColumn(selectedTable, current) ? current : textColumns[0]?.id ?? ""));
    setStatusColumnId((current) => (hasColumn(selectedTable, current) ? current : selectColumns[0]?.id ?? ""));
    setStartDateColumnId((current) => (hasColumn(selectedTable, current) ? current : dateColumns[0]?.id ?? ""));
    setEndDateColumnId((current) =>
      hasColumn(selectedTable, current) ? current : dateColumns[1]?.id ?? dateColumns[0]?.id ?? ""
    );
    setProgressColumnId((current) => (hasColumn(selectedTable, current) ? current : defaultProgressColumn?.id ?? ""));
  }, [
    dateColumns,
    defaultProgressColumn,
    resetColumnSelection,
    selectedTable,
    selectColumns,
    setEndDateColumnId,
    setProgressColumnId,
    setStartDateColumnId,
    setStatusColumnId,
    setTitleColumnId,
    textColumns,
  ]);

  useEffect(() => {
    const dateColumn = endDateColumn ?? startDateColumn;
    const firstDate = records
      .map((record) => parseDateValue(dateColumn ? record.values[dateColumn.id] : undefined))
      .filter((date): date is Date => Boolean(date))
      .sort((a, b) => a.getTime() - b.getTime())[0];

    setCalendarMonth(startOfMonth(firstDate ?? new Date()));
  }, [endDateColumn?.id, records, selectedTable?.id, setCalendarMonth, startDateColumn?.id]);
}
