import type { WorkTable, WorkTableColumn } from "../types";
import { AppViewColumnSelect } from "./AppViewColumnSelect";
import { AppViewTableSelect } from "./AppViewTableSelect";

type AppViewConfigPanelProps = {
  dateColumns: WorkTableColumn[];
  endDateColumn: WorkTableColumn | null;
  progressColumn: WorkTableColumn | null;
  progressColumns: WorkTableColumn[];
  selectColumns: WorkTableColumn[];
  selectedTable: WorkTable | null;
  startDateColumn: WorkTableColumn | null;
  statusColumn: WorkTableColumn | null;
  tables: WorkTable[];
  textColumns: WorkTableColumn[];
  titleColumn: WorkTableColumn | null;
  setEndDateColumnId: (columnId: string) => void;
  setProgressColumnId: (columnId: string) => void;
  setSelectedTableId: (tableId: string) => void;
  setStartDateColumnId: (columnId: string) => void;
  setStatusColumnId: (columnId: string) => void;
  setTitleColumnId: (columnId: string) => void;
};

export function AppViewConfigPanel({
  dateColumns,
  endDateColumn,
  progressColumn,
  progressColumns,
  selectColumns,
  selectedTable,
  startDateColumn,
  statusColumn,
  tables,
  textColumns,
  titleColumn,
  setEndDateColumnId,
  setProgressColumnId,
  setSelectedTableId,
  setStartDateColumnId,
  setStatusColumnId,
  setTitleColumnId,
}: AppViewConfigPanelProps) {
  return (
    <section className="appViewConfig">
      <AppViewTableSelect selectedTable={selectedTable} tables={tables} setSelectedTableId={setSelectedTableId} />
      <AppViewColumnSelect columns={textColumns} label="タイトル" value={titleColumn?.id ?? ""} onChange={setTitleColumnId} />
      <AppViewColumnSelect
        allowEmpty
        columns={selectColumns}
        label="状態"
        value={statusColumn?.id ?? ""}
        onChange={setStatusColumnId}
      />
      <AppViewColumnSelect
        allowEmpty
        columns={dateColumns}
        label="開始日"
        value={startDateColumn?.id ?? ""}
        onChange={setStartDateColumnId}
      />
      <AppViewColumnSelect
        allowEmpty
        columns={dateColumns}
        label="終了日 / 表示日"
        value={endDateColumn?.id ?? ""}
        onChange={setEndDateColumnId}
      />
      <AppViewColumnSelect
        allowEmpty
        columns={progressColumns}
        label="進捗率"
        value={progressColumn?.id ?? ""}
        onChange={setProgressColumnId}
      />
    </section>
  );
}
