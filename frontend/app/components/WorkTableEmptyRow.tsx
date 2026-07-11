import type { MouseEvent } from "react";

type WorkTableEmptyRowProps = {
  activeRecordCount: number;
  columnCount: number;
  insertRecordAt: (insertPosition: number) => void | Promise<void>;
  openEmptyRecordContextMenu: (event: MouseEvent) => void;
};

export function WorkTableEmptyRow({
  activeRecordCount,
  columnCount,
  insertRecordAt,
  openEmptyRecordContextMenu,
}: WorkTableEmptyRowProps) {
  return (
    <tr>
      <td
        colSpan={columnCount + 1}
        className={`workTableEmptyCell ${activeRecordCount === 0 ? "isClickable" : ""}`}
        onClick={() => {
          if (activeRecordCount === 0) {
            void insertRecordAt(1);
          }
        }}
        onContextMenu={openEmptyRecordContextMenu}
      >
        {activeRecordCount === 0 ? "行を追加してください" : "条件に一致する行がありません"}
      </td>
    </tr>
  );
}
