import { useMemo } from "react";

import type { WorkTable } from "../types";
import {
  appViewDateColumns,
  appViewProgressColumns,
  appViewSelectColumns,
  appViewTextColumns,
  columnById,
} from "./appViewColumnGroups";

type UseAppViewColumnsOptions = {
  endDateColumnId: string;
  progressColumnId: string;
  selectedTable: WorkTable | null;
  startDateColumnId: string;
  statusColumnId: string;
  titleColumnId: string;
};

export function useAppViewColumns({
  endDateColumnId,
  progressColumnId,
  selectedTable,
  startDateColumnId,
  statusColumnId,
  titleColumnId,
}: UseAppViewColumnsOptions) {
  const textColumns = useMemo(() => appViewTextColumns(selectedTable), [selectedTable]);
  const dateColumns = useMemo(() => appViewDateColumns(selectedTable), [selectedTable]);
  const selectColumns = useMemo(() => appViewSelectColumns(selectedTable), [selectedTable]);
  const progressColumns = useMemo(() => appViewProgressColumns(selectedTable), [selectedTable]);

  const titleColumn = columnById(selectedTable, titleColumnId) ?? textColumns[0] ?? null;
  const statusColumn = columnById(selectedTable, statusColumnId) ?? selectColumns[0] ?? null;
  const startDateColumn = columnById(selectedTable, startDateColumnId) ?? dateColumns[0] ?? null;
  const endDateColumn =
    columnById(selectedTable, endDateColumnId) ??
    dateColumns.find((column) => column.id !== startDateColumn?.id) ??
    startDateColumn ??
    null;
  const progressColumn = columnById(selectedTable, progressColumnId);
  const defaultProgressColumn =
    progressColumns.find((column) => /進捗|進行率|progress|%/i.test(column.name)) ??
    progressColumns.find((column) => column.field_type === "number") ??
    null;

  return {
    dateColumns,
    defaultProgressColumn,
    endDateColumn,
    progressColumn,
    progressColumns,
    selectColumns,
    startDateColumn,
    statusColumn,
    textColumns,
    titleColumn,
  };
}
