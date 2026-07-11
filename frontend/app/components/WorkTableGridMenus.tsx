import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableColumn, WorkTableRecord } from "../types";
import { ColumnContextMenuSlot, FilterMenuSlot, RecordContextMenuSlot } from "./WorkTableMenuSlots";
import type { ColumnContextMenuState, FilterMenuState, RecordContextMenuState } from "./workTablePanelTypes";

export type WorkTableGridMenusProps = {
  activeRecords: WorkTableRecord[];
  activeTable: WorkTable;
  columnContextMenu: ColumnContextMenuState | null;
  columnFilters: Record<string, string[]>;
  openFilterMenu: FilterMenuState | null;
  recordContextMenu: RecordContextMenuState | null;
  insertRecordAt: (insertPosition: number) => void | Promise<void>;
  insertRecordNear: (record: WorkTableRecord, side: "above" | "below") => void | Promise<void>;
  openColumnCreator: (column: WorkTableColumn, side: "left" | "right") => void;
  setColumnFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  setOpenFilterMenu: (menu: FilterMenuState | null) => void;
  toggleFilterValue: (columnId: string, value: string) => void;
  uniqueColumnValues: (column: WorkTableColumn) => string[];
};

export function WorkTableGridMenus({
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
}: WorkTableGridMenusProps) {
  return (
    <>
      {openFilterMenu ? (
        <FilterMenuSlot
          activeTable={activeTable}
          columnFilters={columnFilters}
          menu={openFilterMenu}
          setColumnFilters={setColumnFilters}
          setOpenFilterMenu={setOpenFilterMenu}
          toggleFilterValue={toggleFilterValue}
          uniqueColumnValues={uniqueColumnValues}
        />
      ) : null}
      {columnContextMenu ? (
        <ColumnContextMenuSlot
          activeTable={activeTable}
          menu={columnContextMenu}
          openColumnCreator={openColumnCreator}
        />
      ) : null}
      {recordContextMenu ? (
        <RecordContextMenuSlot
          activeRecords={activeRecords}
          insertRecordAt={insertRecordAt}
          insertRecordNear={insertRecordNear}
          menu={recordContextMenu}
        />
      ) : null}
    </>
  );
}
