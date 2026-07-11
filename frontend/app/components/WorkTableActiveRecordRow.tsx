import type { MouseEvent, ReactNode } from "react";

import type { WorkTableColumn, WorkTableRecord } from "../types";
import { WorkTableHistoryButton } from "./WorkTableHistoryButton";
import { workTableRecordDragHandlers, workTableRecordDragTitle, workTableRecordRowClass } from "./workTableRecordDrag";

type WorkTableActiveRecordRowProps = {
  canReorderRecords: boolean;
  columns: WorkTableColumn[];
  draggedRecordId: string | null;
  histories: WorkTableRecord[];
  historiesExpanded: boolean;
  index: number;
  record: WorkTableRecord;
  saving: boolean;
  dropRecord: (recordId: string) => void | Promise<void>;
  onOpenRecordMenu: (event: MouseEvent<HTMLTableRowElement>, record: WorkTableRecord) => void;
  renderCell: (record: WorkTableRecord, column: WorkTableColumn) => ReactNode;
  setDraggedRecordId: (recordId: string | null) => void;
  toggleRecordHistories: (record: WorkTableRecord, histories: WorkTableRecord[]) => void;
};

export function WorkTableActiveRecordRow({
  canReorderRecords,
  columns,
  draggedRecordId,
  histories,
  historiesExpanded,
  index,
  record,
  saving,
  dropRecord,
  onOpenRecordMenu,
  renderCell,
  setDraggedRecordId,
  toggleRecordHistories,
}: WorkTableActiveRecordRowProps) {
  const dragProps = workTableRecordDragHandlers({
    canReorderRecords,
    draggedRecordId,
    dropRecord,
    recordId: record.id,
    setDraggedRecordId,
  });

  return (
    <tr
      className={workTableRecordRowClass(record.id, draggedRecordId, historiesExpanded)}
      onContextMenu={(event) => onOpenRecordMenu(event, record)}
      {...dragProps}
    >
      <td className="rowNumberCell" title={workTableRecordDragTitle(canReorderRecords)}>
        <span>{index + 1}</span>
        <WorkTableHistoryButton
          expanded={historiesExpanded}
          historyCount={histories.length}
          saving={saving}
          onClick={() => toggleRecordHistories(record, histories)}
        />
      </td>
      {columns.map((column) => (
        <td key={column.id}>{renderCell(record, column)}</td>
      ))}
    </tr>
  );
}
