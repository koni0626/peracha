import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableColumn, WorkTableRecord } from "../types";
import type { FilterMenuState, WorkTableSortState } from "../components/workTablePanelTypes";
import { inputValue } from "../components/workTableValueUtils";
import { nextFilterMenuState } from "./workTableFilterMenuPosition";
import { nextSortState, toggleColumnFilterValue } from "./workTableGridControlUtils";
import { formatHistoryTime, sortedRecordHistories } from "./workTableHistoryUtils";

type UseWorkTableGridControlsOptions = {
  activeRecords: WorkTableRecord[];
  activeTable: WorkTable | null;
  columnFilters: Record<string, string[]>;
  setColumnFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  setOpenFilterMenu: Dispatch<SetStateAction<FilterMenuState | null>>;
  setSortState: Dispatch<SetStateAction<WorkTableSortState>>;
};

export function useWorkTableGridControls({
  activeRecords,
  activeTable,
  columnFilters,
  setColumnFilters,
  setOpenFilterMenu,
  setSortState,
}: UseWorkTableGridControlsOptions) {
  function uniqueColumnValues(column: WorkTableColumn) {
    if (!activeTable) {
      return [];
    }
    return Array.from(new Set(activeRecords.map((record) => inputValue(record.values[column.id])))).sort((a, b) =>
      a.localeCompare(b, "ja")
    );
  }

  function toggleFilterValue(columnId: string, value: string) {
    setColumnFilters((current) => toggleColumnFilterValue(current, columnId, value));
  }

  function activeFilterCount(columnId: string) {
    return columnFilters[columnId]?.length ?? 0;
  }

  function toggleFilterMenu(columnId: string, button: HTMLButtonElement) {
    setOpenFilterMenu((current) => nextFilterMenuState(current, columnId, button));
  }

  function toggleSort(columnId: string) {
    setSortState((current) => nextSortState(current, columnId));
  }

  function recordHistories(recordId: string) {
    return sortedRecordHistories(activeTable, recordId);
  }

  return {
    activeFilterCount,
    formatHistoryTime,
    recordHistories,
    toggleFilterMenu,
    toggleFilterValue,
    toggleSort,
    uniqueColumnValues,
  };
}
