import { useEffect, useState } from "react";

import type { Message } from "../types";
import { fetchRoomThreadMessages } from "./realtimeChatApi";

type UseChatThreadMessagesOptions = {
  activeRoomId: string | null;
  timelineMessages: Message[];
};

export function useChatThreadMessages({ activeRoomId, timelineMessages }: UseChatThreadMessagesOptions) {
  const [root, setRoot] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRoot(null);
    setMessages([]);
  }, [activeRoomId]);

  useEffect(() => {
    if (!root) {
      return;
    }
    const refreshedRoot = timelineMessages.find((message) => message.id === root.id);
    if (refreshedRoot && refreshedRoot !== root) {
      setRoot(refreshedRoot);
    }
  }, [root, timelineMessages]);

  async function open(message: Message) {
    if (!activeRoomId) {
      return;
    }
    setRoot(message);
    setLoading(true);
    try {
      const data = await fetchRoomThreadMessages(activeRoomId, message.id);
      setMessages(data.items);
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setRoot(null);
  }

  return {
    close,
    loading,
    messages,
    open,
    root,
    setMessages,
    setRoot,
  };
}
