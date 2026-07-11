import { useState } from "react";

import { ChatRoomActiveView } from "./ChatRoomActiveView";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { ChatRoomThreadAside } from "./ChatRoomThreadAside";
import { RoomViewTabs } from "./RoomViewTabs";
import { uploadInlineFileAttachment } from "../hooks/messageComposerUploads";
import { useChatThread } from "../hooks/useChatThread";
import { useMessageHighlighter } from "../hooks/useMessageHighlighter";
import type {
  ChatRoomComposerProps,
  ChatRoomContextSearchProps,
  ChatRoomNoticesProps,
  ChatRoomRoomProps,
  ChatRoomTimelineProps,
} from "./chatRoomViewTypes";
import type { RoomViewKind } from "./roomViewTypes";

type ChatRoomViewProps = {
  composer: ChatRoomComposerProps;
  contextSearch: ChatRoomContextSearchProps;
  notices: ChatRoomNoticesProps;
  room: ChatRoomRoomProps;
  timeline: ChatRoomTimelineProps;
};

export function ChatRoomView({
  composer,
  contextSearch,
  notices,
  room,
  timeline,
}: ChatRoomViewProps) {
  const [activeView, setActiveView] = useState<RoomViewKind>("chat");
  const thread = useChatThread({
    activeRoomId: room.activeRoomId,
    loadRoomFiles: room.loadRoomFiles,
    timelineMessages: timeline.messages,
    uploadRoomFile: room.uploadRoomFile,
  });
  const messageHighlighter = useMessageHighlighter(timeline.ref);

  async function uploadWikiInlineFile(file: File) {
    return uploadInlineFileAttachment(file, room.activeRoomId, room.uploadRoomFile, room.loadRoomFiles);
  }

  return (
    <section
      className="chatWithThread"
      style={thread.root && activeView === "chat" ? { gridTemplateColumns: `minmax(420px, 1fr) 6px ${thread.width}px` } : undefined}
    >
      <div className="chatColumn">
        <ChatRoomHeader
          activeRoom={room.activeRoom}
          activeRoomId={room.activeRoomId}
          contextSearch={contextSearch}
          members={room.members}
          onOpenFolder={room.onOpenFolder}
          onOpenRoomEditor={room.onOpenRoomEditor}
        />

        <RoomViewTabs activeView={activeView} setActiveView={setActiveView} />

        <ChatRoomActiveView
          activeRoomId={room.activeRoomId}
          activeView={activeView}
          composer={composer}
          members={room.members}
          onShowReplyTarget={messageHighlighter.showMessage}
          onUploadWikiInlineFile={uploadWikiInlineFile}
          thread={thread}
          timeline={timeline}
        />
        {notices.chatNotice ? <p className="footerNotice">{notices.chatNotice}</p> : null}
        {notices.error ? <p className="footerError">{notices.error}</p> : null}
      </div>
      <ChatRoomThreadAside activeRoomId={room.activeRoomId} activeView={activeView} composer={composer} thread={thread} />
    </section>
  );
}
