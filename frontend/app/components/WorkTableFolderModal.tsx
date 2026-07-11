import { X } from "lucide-react";

import type { RoomFile, WorkTableColumn, WorkTableFolderValue, WorkTableRecord } from "../types";
import { WorkTableFolderFileList } from "./WorkTableFolderFileList";
import { WorkTableFolderPreviewPane } from "./WorkTableFolderPreviewPane";
import { workTableFolderDropHandlers } from "./workTableFolderDrop";

type WorkTableFolderModalProps = {
  column: WorkTableColumn;
  folderPreviewError: string | null;
  folderValue: WorkTableFolderValue;
  record: WorkTableRecord;
  selectedFile: RoomFile | null;
  onClose: () => void;
  onSelectFile: (fileId: string) => void;
  onUploadFiles: (record: WorkTableRecord, column: WorkTableColumn, files: File[]) => void | Promise<void>;
  setFolderPreviewError: (message: string | null) => void;
};

export function WorkTableFolderModal({
  column,
  folderPreviewError,
  folderValue,
  record,
  selectedFile,
  onClose,
  onSelectFile,
  onUploadFiles,
  setFolderPreviewError,
}: WorkTableFolderModalProps) {
  const dropHandlers = workTableFolderDropHandlers({ column, record, onUploadFiles });

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="workTableFolderTitle">
      <section
        className="workTableFolderModal"
        {...dropHandlers}
      >
        <header>
          <div>
            <p>FOLDER</p>
            <h2 id="workTableFolderTitle">{column.name}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="閉じる">
            <X size={18} />
          </button>
        </header>
        <div className="workTableFolderBody">
          <WorkTableFolderFileList
            folderValue={folderValue}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            onClearPreviewError={() => setFolderPreviewError(null)}
          />
          <WorkTableFolderPreviewPane
            folderPreviewError={folderPreviewError}
            selectedFile={selectedFile}
            onPreviewError={setFolderPreviewError}
          />
        </div>
      </section>
    </div>
  );
}
