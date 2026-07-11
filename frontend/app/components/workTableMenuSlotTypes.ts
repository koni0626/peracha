import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableColumn, WorkTableRecord } from "../types";
import type { ColumnContextMenuState, FilterMenuState, RecordContextMenuState } from "./workTablePanelTypes";

export type FilterMenuSlotProps = {
  activeTable: WorkTable;
  columnFilters: Record<string, string[]>;
  menu: FilterMenuState;
  setColumnFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  setOpenFilterMenu: (menu: FilterMenuState | null) => void;
  toggleFilterValue: (columnId: string, value: string) => void;
  uniqueColumnValues: (column: WorkTableColumn) => string[];
};

export type ColumnContextMenuSlotProps = {
  activeTable: WorkTable;
  menu: ColumnContextMenuState;
  openColumnCreator: (column: WorkTableColumn, side: "left" | "right") => void;
};

export type RecordContextMenuSlotProps = {
  activeRecords: WorkTableRecord[];
  insertRecordAt: (insertPosition: number) => void | Promise<void>;
  insertRecordNear: (record: WorkTableRecord, side: "above" | "below") => void | Promise<void>;
  menu: RecordContextMenuState;
};
