import type { MouseEvent, ReactNode } from "react";

import type { WorkTableColumn, WorkTableRecord } from "../types";
import { WorkTableEmptyRow } from "./WorkTableEmptyRow";
import { WorkTableRecordRows } from "./WorkTableRecordRows";

export type WorkTableGridBodyProps = {
  activeRecordCount: number;
  canReorderRecords: boolean;
  columns: WorkTableColumn[];
  draggedRecordId: string | null;
  expandedHistoryRecordIds: string[];
  filteredRecords: WorkTableRecord[];
  saving: boolean;
  dropRecord: (recordId: string) => void | Promise<void>;
  formatHistoryTime: (value: string) => string;
  insertRecordAt: (insertPosition: number) => void | Promise<void>;
  onOpenEmptyRecordMenu: (event: MouseEvent) => void;
  onOpenRecordMenu: (event: MouseEvent, record: WorkTableRecord) => void;
  recordHistories: (recordId: string) => WorkTableRecord[];
  renderCell: (record: WorkTableRecord, column: WorkTableColumn) => ReactNode;
  renderReadonlyCell: (record: WorkTableRecord, column: WorkTableColumn) => ReactNode;
  setDraggedRecordId: (recordId: string | null) => void;
  toggleRecordHistories: (record: WorkTableRecord, histories: WorkTableRecord[]) => void;
};

export function WorkTableGridBody({
  activeRecordCount,
  canReorderRecords,
  columns,
  draggedRecordId,
  expandedHistoryRecordIds,
  filteredRecords,
  saving,
  dropRecord,
  formatHistoryTime,
  insertRecordAt,
  onOpenEmptyRecordMenu,
  onOpenRecordMenu,
  recordHistories,
  renderCell,
  renderReadonlyCell,
  setDraggedRecordId,
  toggleRecordHistories,
}: WorkTableGridBodyProps) {
  return (
    <tbody>
      {filteredRecords.map((record, index) => {
        const histories = recordHistories(record.id);
        const historiesExpanded = expandedHistoryRecordIds.includes(record.id);
        return (
          <WorkTableRecordRows
            canReorderRecords={canReorderRecords}
            columns={columns}
            draggedRecordId={draggedRecordId}
            histories={histories}
            historiesExpanded={historiesExpanded}
            index={index}
            key={record.id}
            record={record}
            saving={saving}
            dropRecord={dropRecord}
            formatHistoryTime={formatHistoryTime}
            onOpenRecordMenu={onOpenRecordMenu}
            renderCell={renderCell}
            renderReadonlyCell={renderReadonlyCell}
            setDraggedRecordId={setDraggedRecordId}
            toggleRecordHistories={toggleRecordHistories}
          />
        );
      })}
      {filteredRecords.length === 0 ? (
        <WorkTableEmptyRow
          activeRecordCount={activeRecordCount}
          columnCount={columns.length}
          insertRecordAt={insertRecordAt}
          openEmptyRecordContextMenu={onOpenEmptyRecordMenu}
        />
      ) : null}
    </tbody>
  );
}
