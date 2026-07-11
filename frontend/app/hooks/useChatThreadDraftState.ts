import { useState } from "react";

import { toggleSelectedId } from "./stampStateUtils";

export function useChatThreadDraftState() {
  const [draft, setDraft] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [selectedStampIds, setSelectedStampIds] = useState<string[]>([]);

  function resetDraftState() {
    setDraft("");
    setPendingFiles([]);
    setSelectedStampIds([]);
  }

  function toggleStamp(stampId: string) {
    setSelectedStampIds((current) => toggleSelectedId(current, stampId));
  }

  return {
    draft,
    pendingFiles,
    selectedStampIds,
    resetDraftState,
    setDraft,
    setPendingFiles,
    setSelectedStampIds,
    toggleStamp,
  };
}
