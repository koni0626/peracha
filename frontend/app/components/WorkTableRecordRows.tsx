import { Fragment, type MouseEvent, type ReactNode } from "react";

import type { WorkTableColumn, WorkTableRecord } from "../types";
import { WorkTableActiveRecordRow } from "./WorkTableActiveRecordRow";
import { WorkTableHistoryRows } from "./WorkTableHistoryRows";

type WorkTableRecordRowsProps = {
  canReorderRecords: boolean;
  columns: WorkTableColumn[];
  draggedRecordId: string | null;
  histories: WorkTableRecord[];
  historiesExpanded: boolean;
  index: number;
  record: WorkTableRecord;
  saving: boolean;
  dropRecord: (recordId: string) => void | Promise<void>;
  formatHistoryTime: (value: string) => string;
  onOpenRecordMenu: (event: MouseEvent<HTMLTableRowElement>, record: WorkTableRecord) => void;
  renderCell: (record: WorkTableRecord, column: WorkTableColumn) => ReactNode;
  renderReadonlyCell: (record: WorkTableRecord, column: WorkTableColumn) => ReactNode;
  setDraggedRecordId: (recordId: string | null) => void;
  toggleRecordHistories: (record: WorkTableRecord, histories: WorkTableRecord[]) => void;
};

export function WorkTableRecordRows({
  canReorderRecords,
  columns,
  draggedRecordId,
  histories,
  historiesExpanded,
  index,
  record,
  saving,
  dropRecord,
  formatHistoryTime,
  onOpenRecordMenu,
  renderCell,
  renderReadonlyCell,
  setDraggedRecordId,
  toggleRecordHistories,
}: WorkTableRecordRowsProps) {
  return (
    <Fragment>
      <WorkTableActiveRecordRow
        canReorderRecords={canReorderRecords}
        columns={columns}
        draggedRecordId={draggedRecordId}
        histories={histories}
        historiesExpanded={historiesExpanded}
        index={index}
        record={record}
        saving={saving}
        dropRecord={dropRecord}
        onOpenRecordMenu={onOpenRecordMenu}
        renderCell={renderCell}
        setDraggedRecordId={setDraggedRecordId}
        toggleRecordHistories={toggleRecordHistories}
      />
      {historiesExpanded ? (
        <WorkTableHistoryRows
          columns={columns}
          histories={histories}
          formatHistoryTime={formatHistoryTime}
          renderReadonlyCell={renderReadonlyCell}
        />
      ) : null}
    </Fragment>
  );
}
