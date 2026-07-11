import type {
  RoomFile,
  WorkTableColumn,
  WorkTableFileValue,
  WorkTableFolderValue,
  WorkTableRecordValue,
} from "../types";
import { isWorkTableFolderValue } from "../components/workTableValueUtils";

export function uploadedCellFileValue(column: WorkTableColumn, file: RoomFile): WorkTableFileValue {
  return { kind: column.field_type === "image" ? "image" : "file", file };
}

export function appendUploadedFolderFiles(
  currentValue: WorkTableRecordValue | undefined,
  uploadedFiles: RoomFile[],
): WorkTableFolderValue {
  const currentFiles = isWorkTableFolderValue(currentValue) ? currentValue.files : [];
  return { kind: "folder", files: [...currentFiles, ...uploadedFiles] };
}
