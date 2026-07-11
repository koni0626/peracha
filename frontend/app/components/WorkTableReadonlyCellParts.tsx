import type { RoomFile } from "../types";
import { WorkTableFileThumbnail } from "./WorkTableFilePreview";

export function WorkTableReadonlyFileValue({ file }: { file: RoomFile }) {
  return (
    <span className="workTableHistoryFile">
      <WorkTableFileThumbnail file={file} />
      <span>{file.original_name}</span>
    </span>
  );
}

export function WorkTableReadonlyFolderValue({ fileCount }: { fileCount: number }) {
  return <span className="workTableHistoryValue">フォルダ: {fileCount}件</span>;
}

export function WorkTableReadonlyBlankValue() {
  return <span className="workTableHistoryBlank">未入力</span>;
}

export function WorkTableReadonlyTextValue({ value }: { value: string }) {
  return <span className="workTableHistoryValue">{value}</span>;
}
