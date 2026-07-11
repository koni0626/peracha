import { useState } from "react";

import type {
  ColumnContextMenuState,
  FilterMenuState,
  RecordContextMenuState,
  WorkTableSortState,
} from "../components/workTablePanelTypes";

export function useWorkTableGridUiState() {
  const [sortState, setSortState] = useState<WorkTableSortState>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [openFilterMenu, setOpenFilterMenu] = useState<FilterMenuState | null>(null);
  const [columnContextMenu, setColumnContextMenu] = useState<ColumnContextMenuState | null>(null);
  const [recordContextMenu, setRecordContextMenu] = useState<RecordContextMenuState | null>(null);
  const [expandedHistoryRecordIds, setExpandedHistoryRecordIds] = useState<string[]>([]);

  return {
    columnContextMenu,
    columnFilters,
    expandedHistoryRecordIds,
    openFilterMenu,
    recordContextMenu,
    sortState,
    setColumnContextMenu,
    setColumnFilters,
    setExpandedHistoryRecordIds,
    setOpenFilterMenu,
    setRecordContextMenu,
    setSortState,
  };
}
