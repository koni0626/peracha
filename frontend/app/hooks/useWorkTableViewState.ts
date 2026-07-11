import { useMemo } from "react";

import type { WorkTable } from "../types";
import type { WorkTableSortState } from "../components/workTablePanelTypes";
import { inputValue } from "../components/workTableValueUtils";

type UseWorkTableViewStateOptions = {
  activeTableId: string | null;
  columnFilters: Record<string, string[]>;
  keyword: string;
  sortState: WorkTableSortState;
  tables: WorkTable[];
};

export function useWorkTableViewState({
  activeTableId,
  columnFilters,
  keyword,
  sortState,
  tables,
}: UseWorkTableViewStateOptions) {
  const activeTable = useMemo(
    () => tables.find((table) => table.id === activeTableId) ?? tables[0] ?? null,
    [activeTableId, tables]
  );
  const canReorderRecords = !keyword.trim() && !sortState && Object.values(columnFilters).every((values) => values.length === 0);
  const activeRecords = useMemo(() => activeTable?.records.filter((record) => !record.parent_record_id) ?? [], [activeTable]);
  const filteredRecords = useMemo(() => {
    if (!activeTable) {
      return [];
    }
    const keywordText = keyword.trim().toLowerCase();
    const records = activeRecords.filter((record) => {
      const values = Object.values(record.values).map((value) => inputValue(value));
      const keywordMatched = !keywordText || values.some((value) => value.toLowerCase().includes(keywordText));
      if (!keywordMatched) {
        return false;
      }
      return activeTable.columns.every((column) => {
        const selected = columnFilters[column.id] ?? [];
        if (selected.length === 0) {
          return true;
        }
        return selected.includes(inputValue(record.values[column.id]));
      });
    });
    if (!sortState) {
      return records;
    }
    const direction = sortState.direction === "asc" ? 1 : -1;
    const column = activeTable.columns.find((item) => item.id === sortState.columnId);
    return [...records].sort((a, b) => {
      const left = a.values[sortState.columnId];
      const right = b.values[sortState.columnId];
      if (column?.field_type === "number") {
        return ((Number(left) || 0) - (Number(right) || 0)) * direction;
      }
      return inputValue(left).localeCompare(inputValue(right), "ja") * direction;
    });
  }, [activeRecords, activeTable, columnFilters, keyword, sortState]);

  return {
    activeRecords,
    activeTable,
    canReorderRecords,
    filteredRecords,
  };
}
