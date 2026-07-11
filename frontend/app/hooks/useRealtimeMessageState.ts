import { useRef, useState } from "react";

import type { Message } from "../types";

export function useRealtimeMessageState() {
  const [messages, setMessages] = useState<Message[]>([]);
  const lastMessageAtRef = useRef<string | null>(null);
  const roomMessageCursorRef = useRef<Record<string, string | null>>({});

  function resetRealtimeMessages() {
    setMessages([]);
    lastMessageAtRef.current = null;
    roomMessageCursorRef.current = {};
  }

  return {
    lastMessageAtRef,
    messages,
    resetRealtimeMessages,
    roomMessageCursorRef,
    setMessages,
  };
}
