export type FilterMenuState = {
  columnId: string;
  left: number;
  top: number;
};

export type ColumnContextMenuState = {
  columnId: string;
  x: number;
  y: number;
};

export type RecordContextMenuState = {
  recordId: string | null;
  x: number;
  y: number;
};

export type FolderModalState = {
  recordId: string;
  columnId: string;
};

export type WorkTableSortState = {
  columnId: string;
  direction: "asc" | "desc";
} | null;
