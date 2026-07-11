import type { DragEvent } from "react";

import type { WorkTableColumn, WorkTableRecord } from "../types";

type WorkTableFolderDropHandlersOptions = {
  column: WorkTableColumn;
  record: WorkTableRecord;
  onUploadFiles: (record: WorkTableRecord, column: WorkTableColumn, files: File[]) => void | Promise<void>;
};

export function workTableFolderDropHandlers({ column, record, onUploadFiles }: WorkTableFolderDropHandlersOptions) {
  return {
    onDragOver(event: DragEvent<HTMLElement>) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    },
    onDrop(event: DragEvent<HTMLElement>) {
      event.preventDefault();
      void onUploadFiles(record, column, Array.from(event.dataTransfer.files));
    },
  };
}
