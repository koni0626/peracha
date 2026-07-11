import type { Dispatch, SetStateAction } from "react";

import { hasMessagePayload } from "./messageComposerGuards";
import { useComposerAttachments } from "./useComposerAttachments";
import { useComposerStampPanel } from "./useComposerStampPanel";

type UseComposerSurfaceStateOptions = {
  activeRoomId: string | null;
  draft: string;
  pendingFiles: File[];
  selectedStampIds: string[];
  setPendingFiles: Dispatch<SetStateAction<File[]>>;
};

export function useComposerSurfaceState({
  activeRoomId,
  draft,
  pendingFiles,
  selectedStampIds,
  setPendingFiles,
}: UseComposerSurfaceStateOptions) {
  const stampPanel = useComposerStampPanel();
  const attachments = useComposerAttachments({
    activeRoomId,
    setPendingFiles,
  });
  const hasPayload = hasMessagePayload(draft, pendingFiles.length, selectedStampIds.length);

  return {
    ...attachments,
    closeStampPanel: stampPanel.closeStampPanel,
    hasPayload,
    openStampPanel: stampPanel.openStampPanel,
    stampPanelOpen: stampPanel.open,
  };
}
