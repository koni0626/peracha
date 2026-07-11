import { useMemo } from "react";

import { activeRecords, selectedWorkTable } from "../components/appViewUtils";
import { buildAppViewsState } from "./appViewsStateBuilder";
import { useAppGanttProgress } from "./useAppGanttProgress";
import { useAppKanbanMover } from "./useAppKanbanMover";
import { useAppRecordEditor } from "./useAppRecordEditor";
import { useAppViewConfigState } from "./useAppViewConfigState";
import { useAppViewColumns } from "./useAppViewColumns";
import { useAppViewSelectionEffects } from "./useAppViewSelectionEffects";
import { useAppViewTables } from "./useAppViewTables";

export function useAppViews(roomId: string | null) {
  const config = useAppViewConfigState();
  const { error, loading, selectedTableId, setError, setSelectedTableId, setTables, tables } = useAppViewTables(roomId);

  const selectedTable = useMemo(() => selectedWorkTable(tables, selectedTableId), [selectedTableId, tables]);
  const records = useMemo(() => activeRecords(selectedTable), [selectedTable]);
  const columns = useAppViewColumns({
    endDateColumnId: config.endDateColumnId,
    progressColumnId: config.progressColumnId,
    selectedTable,
    startDateColumnId: config.startDateColumnId,
    statusColumnId: config.statusColumnId,
    titleColumnId: config.titleColumnId,
  });

  useAppViewSelectionEffects({
    config,
    dateColumns: columns.dateColumns,
    defaultProgressColumn: columns.defaultProgressColumn,
    endDateColumn: columns.endDateColumn,
    records,
    selectColumns: columns.selectColumns,
    selectedTable,
    startDateColumn: columns.startDateColumn,
    textColumns: columns.textColumns,
  });

  const recordEditor = useAppRecordEditor({ selectedTable, setError, setTables });
  const ganttProgress = useAppGanttProgress({
    progressColumn: columns.progressColumn,
    selectedTable,
    setError,
    setTables,
    tables,
  });
  const kanbanMover = useAppKanbanMover({ selectedTable, setError, setTables, statusColumn: columns.statusColumn, tables });

  return buildAppViewsState({
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
  });
}

export type AppViewsState = ReturnType<typeof useAppViews>;
