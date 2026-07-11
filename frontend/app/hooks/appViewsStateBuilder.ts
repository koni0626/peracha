import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableRecord } from "../types";
import { appRecordTitle } from "../components/appViewUtils";
import type { useAppGanttProgress } from "./useAppGanttProgress";
import type { useAppKanbanMover } from "./useAppKanbanMover";
import type { useAppRecordEditor } from "./useAppRecordEditor";
import type { useAppViewColumns } from "./useAppViewColumns";
import type { useAppViewConfigState } from "./useAppViewConfigState";

type BuildAppViewsStateOptions = {
  columns: ReturnType<typeof useAppViewColumns>;
  config: ReturnType<typeof useAppViewConfigState>;
  error: string | null;
  ganttProgress: ReturnType<typeof useAppGanttProgress>;
  kanbanMover: ReturnType<typeof useAppKanbanMover>;
  loading: boolean;
  recordEditor: ReturnType<typeof useAppRecordEditor>;
  records: WorkTableRecord[];
  selectedTable: WorkTable | null;
  setSelectedTableId: Dispatch<SetStateAction<string>>;
  tables: WorkTable[];
};

export function buildAppViewsState({
  columns,
  config,
  error,
  ganttProgress,
  kanbanMover,
  loading,
  recordEditor,
  records,
  selectedTable,
  setSelectedTableId,
  tables,
}: BuildAppViewsStateOptions) {
  return {
    calendarMonth: config.calendarMonth,
    dateColumns: columns.dateColumns,
    dragOverKanbanStatus: kanbanMover.dragOverKanbanStatus,
    draggedKanbanRecordId: kanbanMover.draggedKanbanRecordId,
    editingRecord: recordEditor.editingRecord,
    endDateColumn: columns.endDateColumn,
    error,
    ganttScale: config.ganttScale,
    loading,
    progressColumn: columns.progressColumn,
    progressColumns: columns.progressColumns,
    recordDraft: recordEditor.recordDraft,
    recordEditorOpen: recordEditor.recordEditorOpen,
    records,
    savingRecord: recordEditor.savingRecord,
    selectColumns: columns.selectColumns,
    selectedKind: config.selectedKind,
    selectedTable,
    startDateColumn: columns.startDateColumn,
    statusColumn: columns.statusColumn,
    tables,
    textColumns: columns.textColumns,
    titleColumn: columns.titleColumn,
    closeRecordEditor: recordEditor.closeRecordEditor,
    moveKanbanRecord: kanbanMover.moveKanbanRecord,
    openNewRecordEditor: recordEditor.openNewRecordEditor,
    openRecordEditor: recordEditor.openRecordEditor,
    recordTitle: (record: WorkTableRecord) => appRecordTitle(record, columns.titleColumn),
    saveRecordEditor: recordEditor.saveRecordEditor,
    setCalendarMonth: config.setCalendarMonth,
    setDragOverKanbanStatus: kanbanMover.setDragOverKanbanStatus,
    setDraggedKanbanRecordId: kanbanMover.setDraggedKanbanRecordId,
    setEndDateColumnId: config.setEndDateColumnId,
    setGanttScale: config.setGanttScale,
    setProgressColumnId: config.setProgressColumnId,
    setRecordDraft: recordEditor.setRecordDraft,
    setSelectedKind: config.setSelectedKind,
    setSelectedTableId,
    setStartDateColumnId: config.setStartDateColumnId,
    setStatusColumnId: config.setStatusColumnId,
    setTitleColumnId: config.setTitleColumnId,
    updateGanttProgress: ganttProgress.updateGanttProgress,
  };
}
