import { useMemo, useState } from "react";

const ROOT_FOLDER_ID = "__stamp_root__";

type UseStampPickerModalOptions = {
  selectedStampIds: string[];
  onClose: () => void;
  onToggleStamp: (stampId: string) => void;
};

export function useStampPickerModal({ selectedStampIds, onClose, onToggleStamp }: UseStampPickerModalOptions) {
  const initialFolderId = useMemo(() => ROOT_FOLDER_ID, []);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(initialFolderId);

  function useStamp(stampId: string) {
    if (!selectedStampIds.includes(stampId)) {
      onToggleStamp(stampId);
    }
    onClose();
  }

  return {
    activeFolderId,
    setActiveFolderId,
    useStamp,
  };
}
