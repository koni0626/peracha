import { LinkIcon, Video } from "lucide-react";

import { apiUrl } from "../api";
import type { Attachment } from "../types";
import { isImageAttachment, isVideoAttachment } from "./messageAttachmentUtils";

export function MessageAttachmentItem({ attachment }: { attachment: Attachment }) {
  const attachmentUrl = apiUrl(attachment.url);

  if (isImageAttachment(attachment)) {
    return (
      <a className="imageAttachment" href={attachmentUrl} target="_blank" rel="noreferrer">
        <img src={attachmentUrl} alt={attachment.title} loading="lazy" />
      </a>
    );
  }

  if (isVideoAttachment(attachment)) {
    return (
      <div className="videoAttachment">
        <video src={attachmentUrl} controls preload="metadata" />
        <a href={attachmentUrl} target="_blank" rel="noreferrer" title="動画を開く" aria-label="動画を開く">
          <Video size={14} />
        </a>
      </div>
    );
  }

  return (
    <a href={attachmentUrl} target="_blank" rel="noreferrer">
      <LinkIcon size={14} />
      <span>{attachment.title}</span>
    </a>
  );
}
