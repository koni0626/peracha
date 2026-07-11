import type { RefObject } from "react";

import type { Message } from "../types";
import { MessageRow } from "./MessageRow";


type MessageListProps = {
  messages: Message[];
  onContentLoad: () => void;
  onOpenThread: (message: Message) => void;
  onScroll: () => void;
  onShowReplyTarget: (messageId: string) => void;
  timelineRef: RefObject<HTMLDivElement | null>;
};

export function MessageList({
  messages,
  onContentLoad,
  onOpenThread,
  onScroll,
  onShowReplyTarget,
  timelineRef,
}: MessageListProps) {
  return (
    <div
      className="timeline"
      onLoadCapture={onContentLoad}
      onLoadedMetadataCapture={onContentLoad}
      onScroll={onScroll}
      ref={timelineRef}
    >
      {messages.map((message) => (
        <MessageRow
          key={message.id}
          message={message}
          onOpenThread={onOpenThread}
          onShowReplyTarget={onShowReplyTarget}
        />
      ))}
    </div>
  );
}
