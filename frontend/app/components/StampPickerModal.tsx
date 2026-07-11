"use client";

import { X } from "lucide-react";

import { StampExplorer } from "./StampExplorer";
import type { Stamp, StampFolder } from "../types";
import { useStampPickerModal } from "./useStampPickerModal";

type StampPickerModalProps = {
  uploading?: boolean;
  stamps: Stamp[];
  stampFolders: StampFolder[];
  selectedStampIds: string[];
  onClose: () => void;
  onToggleStamp: (stampId: string) => void;
  onUploadFiles?: (files: File[], folderId: string | null) => void | Promise<void>;
};

export function StampPickerModal({
  uploading = false,
  stamps,
  stampFolders,
  selectedStampIds,
  onClose,
  onToggleStamp,
  onUploadFiles,
}: StampPickerModalProps) {
  const { activeFolderId, setActiveFolderId, useStamp } = useStampPickerModal({
    selectedStampIds,
    onClose,
    onToggleStamp,
  });

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="stampPickerTitle">
      <section className="stampPickerModal">
        <header>
          <div>
            <p className="eyebrow">Stamp</p>
            <h2 id="stampPickerTitle">スタンプを選択</h2>
          </div>
          <button type="button" className="iconButton" title="閉じる" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <StampExplorer
          activeFolderId={activeFolderId}
          mode="select"
          selectedStampIds={selectedStampIds}
          stampFolders={stampFolders}
          stamps={stamps}
          uploading={uploading}
          onSelectFolder={setActiveFolderId}
          onUploadFiles={onUploadFiles}
          onUseStamp={useStamp}
        />

        <footer>
          <span>{selectedStampIds.length > 0 ? `${selectedStampIds.length}件選択中` : "未選択"}</span>
          <button type="button" onClick={onClose}>
            閉じる
          </button>
        </footer>
      </section>
    </div>
  );
}
