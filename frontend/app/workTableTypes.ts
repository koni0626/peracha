import type { RoomFile } from "./chatTypes";

export type WorkTableFieldType = "text" | "number" | "date" | "markdown" | "select" | "user" | "image" | "file" | "folder";

export type WorkTableColumn = {
  id: string;
  table_id: string;
  name: string;
  field_type: WorkTableFieldType;
  position: number;
  options: string[];
  created_at: string;
};

export type WorkTableFileValue = {
  kind: "image" | "file";
  file: RoomFile;
};

export type WorkTableFolderValue = {
  kind: "folder";
  files: RoomFile[];
};

export type WorkTableRecordValue = string | number | boolean | null | WorkTableFileValue | WorkTableFolderValue;

export type WorkTableRecord = {
  id: string;
  table_id: string;
  parent_record_id: string | null;
  position: number;
  values: Record<string, WorkTableRecordValue>;
  created_at: string;
  updated_at: string;
};

export type WorkTable = {
  id: string;
  room_id: string;
  name: string;
  description_markdown: string | null;
  position: number;
  columns: WorkTableColumn[];
  records: WorkTableRecord[];
  created_at: string;
  updated_at: string;
};
