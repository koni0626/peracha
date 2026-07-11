import { Reply } from "lucide-react";

import type { Message } from "../types";
import { MessageAvatar } from "./MessageAvatar";
import { MessageContent } from "./MessageContent";

type MessageRowProps = {
  message: Message;
  onOpenThread: (message: Message) => void;
  onShowReplyTarget: (messageId: string) => void;
};

export function MessageRow({ message, onOpenThread, onShowReplyTarget }: MessageRowProps) {
  return (
    <article className="messageRow" data-message-id={message.id}>
      <MessageAvatar avatarUrl={message.sender_avatar_url} senderName={message.sender_name} />
      <div className="messageBody">
        <div className="messageMeta">
          <strong>{message.sender_name ?? message.sender_type}</strong>
          <time>{new Date(message.created_at).toLocaleString("ja-JP")}</time>
          <span className={`readBadge ${message.read_status === "既読" ? "isRead" : "isUnread"}`}>
            {message.read_status}
            {message.read_count > 1 ? ` ${message.read_count}` : ""}
          </span>
          <button type="button" className="messageReplyButton" title="スレッドで返信" onClick={() => onOpenThread(message)}>
            <Reply size={14} />
          </button>
        </div>
        {message.reply_to ? (
          <button type="button" className="messageReplyCard" onClick={() => onShowReplyTarget(message.reply_to?.id ?? "")}>
            <strong>返信先: {message.reply_to.sender_name ?? "メッセージ"}</strong>
            <span>{message.reply_to.body.trim() || "添付メッセージ"}</span>
          </button>
        ) : null}
        <MessageContent message={message} />
        {message.thread_reply_count > 0 ? (
          <button type="button" className="threadOpenButton" onClick={() => onOpenThread(message)}>
            返信 {message.thread_reply_count}件
          </button>
        ) : null}
      </div>
    </article>
  );
}
