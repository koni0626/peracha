import { useEffect, useState } from "react";

import type { Message } from "../types";

export function usePerachaComposerState(activeRoomId: string | null) {
  const [mode, setMode] = useState<"docked" | "floating">("docked");
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  useEffect(() => {
    setReplyTo(null);
  }, [activeRoomId]);

  return {
    draft,
    mode,
    replyTo,
    setDraft,
    setMode,
    setReplyTo,
  };
}
