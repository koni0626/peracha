import type { Message } from "../types";
import { LegacyMessageStamps } from "./LegacyMessageStamps";
import { MarkdownContent } from "./MarkdownContent";
import { MessageAttachments } from "./MessageAttachments";

export function MessageContent({ message }: { message: Message }) {
  return (
    <>
      <MarkdownContent text={message.body} />
      <LegacyMessageStamps messageId={message.id} stamps={message.stamps ?? []} />
      <MessageAttachments attachments={message.attachments ?? []} />
    </>
  );
}
