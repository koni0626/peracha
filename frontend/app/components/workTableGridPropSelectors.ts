import type { WorkTableGridBodyProps } from "./WorkTableGridBody";
import type { WorkTableGridHeaderProps } from "./WorkTableGridHeader";
import type { WorkTableGridMenusProps } from "./WorkTableGridMenus";
import type { WorkTableGridProps } from "./workTableGridTypes";

export function selectWorkTableGridHeaderProps({
  activeTable,
  activeFilterCount,
  draggedColumnId,
  dropColumn,
  openColumnContextMenu,
  openColumnEditor,
  removeColumn,
  saving,
  setDraggedColumnId,
  sortState,
  toggleFilterMenu,
  toggleSort,
}: WorkTableGridProps): WorkTableGridHeaderProps {
  return {
    columns: activeTable.columns,
    draggedColumnId,
    saving,
    sortState,
    activeFilterCount,
    dropColumn,
    openColumnContextMenu,
    openColumnEditor,
    removeColumn,
    setDraggedColumnId,
    toggleFilterMenu,
    toggleSort,
  };
}

export function selectWorkTableGridBodyProps({
  activeRecords,
  activeTable,
  canReorderRecords,
  draggedRecordId,
  dropRecord,
  expandedHistoryRecordIds,
  filteredRecords,
  formatHistoryTime,
  insertRecordAt,
  openEmptyRecordContextMenu,
  openRecordContextMenu,
  recordHistories,
  renderCell,
  renderReadonlyCell,
  saving,
  setDraggedRecordId,
  toggleRecordHistories,
}: WorkTableGridProps): WorkTableGridBodyProps {
  return {
    activeRecordCount: activeRecords.length,
    canReorderRecords,
    columns: activeTable.columns,
    draggedRecordId,
    expandedHistoryRecordIds,
    filteredRecords,
    saving,
    dropRecord,
    formatHistoryTime,
    insertRecordAt,
    onOpenEmptyRecordMenu: openEmptyRecordContextMenu,
    onOpenRecordMenu: openRecordContextMenu,
    recordHistories,
    renderCell,
    renderReadonlyCell,
    setDraggedRecordId,
    toggleRecordHistories,
  };
}

export function selectWorkTableGridMenuProps({
  activeRecords,
  activeTable,
  columnContextMenu,
  columnFilters,
  insertRecordAt,
  insertRecordNear,
  openColumnCreator,
  openFilterMenu,
  recordContextMenu,
  setColumnFilters,
  setOpenFilterMenu,
  toggleFilterValue,
  uniqueColumnValues,
}: WorkTableGridProps): WorkTableGridMenusProps {
  return {
    activeRecords,
    activeTable,
    columnContextMenu,
    columnFilters,
    openFilterMenu,
    recordContextMenu,
    insertRecordAt,
    insertRecordNear,
    openColumnCreator,
    setColumnFilters,
    setOpenFilterMenu,
    toggleFilterValue,
    uniqueColumnValues,
  };
}
