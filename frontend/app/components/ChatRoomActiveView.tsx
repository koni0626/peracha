import { AppViewsPanel } from "./AppViewsPanel";
import { ChatRoomMainPane } from "./ChatRoomMainPane";
import type { ChatRoomComposerProps, ChatRoomTimelineProps } from "./chatRoomViewTypes";
import type { RoomViewKind } from "./roomViewTypes";
import { WikiPanel } from "./WikiPanel";
import { WorkTablesPanel } from "./WorkTablesPanel";
import type { useChatThread } from "../hooks/useChatThread";
import type { RoomMember } from "../types";

type ChatRoomActiveViewProps = {
  activeRoomId: string | null;
  activeView: RoomViewKind;
  composer: ChatRoomComposerProps;
  members: RoomMember[];
  onShowReplyTarget: (messageId: string) => void;
  onUploadWikiInlineFile: (file: File) => Promise<{ title: string; url: string; content_type: string | null }>;
  thread: ReturnType<typeof useChatThread>;
  timeline: ChatRoomTimelineProps;
};

export function ChatRoomActiveView({
  activeRoomId,
  activeView,
  composer,
  members,
  onShowReplyTarget,
  onUploadWikiInlineFile,
  thread,
  timeline,
}: ChatRoomActiveViewProps) {
  if (activeView === "chat") {
    return (
      <ChatRoomMainPane
        activeRoomId={activeRoomId}
        composer={composer}
        onShowReplyTarget={onShowReplyTarget}
        thread={thread}
        timeline={timeline}
      />
    );
  }

  if (activeView === "tables") {
    return <WorkTablesPanel members={members} roomId={activeRoomId} />;
  }

  if (activeView === "wiki") {
    return <WikiPanel roomId={activeRoomId} onUploadInlineFile={onUploadWikiInlineFile} />;
  }

  return <AppViewsPanel members={members} roomId={activeRoomId} />;
}
