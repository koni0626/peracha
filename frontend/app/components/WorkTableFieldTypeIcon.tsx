import { CalendarDays, FileImage, FileText, FolderOpen, Hash, ListPlus, Text, UserRound } from "lucide-react";

import type { WorkTableFieldType } from "../types";

export const WORK_TABLE_FIELD_TYPES: Array<{ value: WorkTableFieldType; label: string }> = [
  { value: "text", label: "テキスト" },
  { value: "number", label: "数字" },
  { value: "date", label: "日付" },
  { value: "markdown", label: "Markdown" },
  { value: "select", label: "選択肢" },
  { value: "user", label: "名前" },
  { value: "image", label: "画像" },
  { value: "file", label: "ファイル" },
  { value: "folder", label: "フォルダ" },
];

export function WorkTableFieldTypeIcon({ type }: { type: WorkTableFieldType }) {
  if (type === "number") {
    return <Hash size={14} />;
  }
  if (type === "date") {
    return <CalendarDays size={14} />;
  }
  if (type === "select") {
    return <ListPlus size={14} />;
  }
  if (type === "user") {
    return <UserRound size={14} />;
  }
  if (type === "image") {
    return <FileImage size={14} />;
  }
  if (type === "file") {
    return <FileText size={14} />;
  }
  if (type === "folder") {
    return <FolderOpen size={14} />;
  }
  return <Text size={14} />;
}
