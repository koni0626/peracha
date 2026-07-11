import type { Attachment } from "../types";
import { MessageAttachmentItem } from "./MessageAttachmentItem";

export function MessageAttachments({ attachments }: { attachments: Attachment[] }) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="messageAttachments">
      {attachments.map((attachment) => (
        <MessageAttachmentItem attachment={attachment} key={attachment.url} />
      ))}
    </div>
  );
}
