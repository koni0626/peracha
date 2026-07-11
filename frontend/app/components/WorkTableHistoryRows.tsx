import type { ReactNode } from "react";

import type { WorkTableColumn, WorkTableRecord } from "../types";

type WorkTableHistoryRowsProps = {
  columns: WorkTableColumn[];
  histories: WorkTableRecord[];
  formatHistoryTime: (value: string) => string;
  renderReadonlyCell: (record: WorkTableRecord, column: WorkTableColumn) => ReactNode;
};

export function WorkTableHistoryRows({
  columns,
  histories,
  formatHistoryTime,
  renderReadonlyCell,
}: WorkTableHistoryRowsProps) {
  return (
    <>
      {histories.map((history) => (
        <tr className="workTableHistoryRow" key={history.id}>
          <td className="rowNumberCell workTableHistoryMeta">
            <span>履歴</span>
            <small>{formatHistoryTime(history.created_at)}</small>
          </td>
          {columns.map((column) => (
            <td key={column.id}>{renderReadonlyCell(history, column)}</td>
          ))}
        </tr>
      ))}
    </>
  );
}
