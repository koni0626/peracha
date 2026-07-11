type CanSendMessageOptions = {
  activeRoomId: string | null;
  clarifying: boolean;
  creatingPeraichi: boolean;
  draft: string;
  pendingFileCount: number;
  selectedStampCount: number;
  sending: boolean;
};

export function canSendMessage({
  activeRoomId,
  clarifying,
  creatingPeraichi,
  draft,
  pendingFileCount,
  selectedStampCount,
  sending,
}: CanSendMessageOptions) {
  if (!activeRoomId || sending || creatingPeraichi || clarifying) {
    return false;
  }
  return hasMessagePayload(draft, pendingFileCount, selectedStampCount);
}

export function hasMessagePayload(draft: string, pendingFileCount: number, selectedStampCount: number) {
  return Boolean(draft.trim() || pendingFileCount > 0 || selectedStampCount > 0);
}
