import type { Message } from "../types";
import { MessageContent } from "./MessageContent";

type ThreadMessageListProps = {
  loading: boolean;
  messages: Message[];
  rootMessage: Message;
};

function ThreadMessage({ message, isRoot = false }: { message: Message; isRoot?: boolean }) {
  return (
    <article className={isRoot ? "threadMessage isRoot" : "threadMessage"}>
      <div className="threadMessageMeta">
        <strong>{message.sender_name ?? message.sender_type}</strong>
        <time>{new Date(message.created_at).toLocaleString("ja-JP")}</time>
      </div>
      <MessageContent message={message} />
    </article>
  );
}

export function ThreadMessageList({ loading, messages, rootMessage }: ThreadMessageListProps) {
  return (
    <div className="threadPanelBody">
      <ThreadMessage message={rootMessage} isRoot />
      <div className="threadReplies">
        {loading ? <p className="threadEmptyText">読み込み中...</p> : null}
        {!loading && messages.length === 0 ? <p className="threadEmptyText">まだ返信はありません。</p> : null}
        {messages.map((message) => (
          <ThreadMessage message={message} key={message.id} />
        ))}
      </div>
    </div>
  );
}
