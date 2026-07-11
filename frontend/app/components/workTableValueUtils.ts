import { apiUrl } from "../api";
import type {
  RoomFile,
  WorkTableColumn,
  WorkTableFileValue,
  WorkTableFolderValue,
  WorkTableRecordValue
} from "../types";

export function inputValue(value: WorkTableRecordValue | undefined) {
  if (value === null || value === undefined) {
    return "";
  }
  if (isWorkTableFileValue(value)) {
    return value.file.original_name;
  }
  if (isWorkTableFolderValue(value)) {
    return value.files.map((file) => file.original_name).join(" ");
  }
  return String(value);
}

export function parseValue(column: WorkTableColumn, value: string): WorkTableRecordValue {
  if (value === "") {
    return null;
  }
  if (column.field_type === "number") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return value;
}

export function isWorkTableFileValue(value: WorkTableRecordValue | undefined): value is WorkTableFileValue {
  return Boolean(value && typeof value === "object" && "file" in value);
}

export function isWorkTableFolderValue(value: WorkTableRecordValue | undefined): value is WorkTableFolderValue {
  return Boolean(value && typeof value === "object" && "files" in value);
}

export function filePreviewSrc(file: RoomFile) {
  return apiUrl(file.preview_url ?? file.download_url);
}

export function isImageRoomFile(file: RoomFile) {
  return file.preview_kind === "image" || file.content_type?.startsWith("image/");
}

export function isOfficeRoomFile(file: RoomFile): file is RoomFile & { preview_kind: "docx" | "xlsx" | "pptx" } {
  return file.preview_kind === "docx" || file.preview_kind === "xlsx" || file.preview_kind === "pptx";
}
