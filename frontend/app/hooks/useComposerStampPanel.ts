import { useState } from "react";

export function useComposerStampPanel() {
  const [open, setOpen] = useState(false);

  return {
    closeStampPanel: () => setOpen(false),
    open,
    openStampPanel: () => setOpen(true),
  };
}
