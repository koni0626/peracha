import { useState } from "react";

import { reorderSelectedIds, toggleSelectedId } from "./stampStateUtils";

export function useSelectedStamps() {
  const [selectedStampIds, setSelectedStampIds] = useState<string[]>([]);

  function clearSelectedStamps() {
    setSelectedStampIds([]);
  }

  function toggleStamp(stampId: string) {
    setSelectedStampIds((current) => toggleSelectedId(current, stampId));
  }

  function reorderSelectedStamps(stampIds: string[]) {
    setSelectedStampIds((current) => reorderSelectedIds(current, stampIds));
  }

  return {
    clearSelectedStamps,
    reorderSelectedStamps,
    selectedStampIds,
    setSelectedStampIds,
    toggleStamp,
  };
}
