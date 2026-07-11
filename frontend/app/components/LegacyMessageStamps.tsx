import { useState } from "react";

import { apiUrl } from "../api";
import type { StampUse } from "../types";

function LegacyMessageStamp({ stamp }: { stamp: StampUse }) {
  const [isDeleted, setIsDeleted] = useState(false);

  if (isDeleted) {
    return <span className="deletedStampNotice">スタンプは削除されました</span>;
  }

  return <img src={apiUrl(stamp.image_url)} alt={stamp.title} title={stamp.title} onError={() => setIsDeleted(true)} />;
}

export function LegacyMessageStamps({ messageId, stamps }: { messageId: string; stamps: StampUse[] }) {
  if (stamps.length === 0) {
    return null;
  }
  return (
    <div className="messageStamps">
      {stamps.map((stamp) => (
        <LegacyMessageStamp stamp={stamp} key={`${messageId}-${stamp.id}`} />
      ))}
    </div>
  );
}
