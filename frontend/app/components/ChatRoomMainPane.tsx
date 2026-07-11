import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import type { Message } from "../types";
import type { ChatRoomComposerProps, ChatRoomTimelineProps } from "./chatRoomViewTypes";

type ChatRoomMainPaneProps = {
  composer: ChatRoomComposerProps;
  thread: {
    open: (message: Message) => void;
  };
  timeline: ChatRoomTimelineProps;
  onShowReplyTarget: (messageId: string) => void;
  activeRoomId: string | null;
};

export function ChatRoomMainPane({ activeRoomId, composer, onShowReplyTarget, thread, timeline }: ChatRoomMainPaneProps) {
  return (
    <>
      <MessageList
        messages={timeline.messages}
        onContentLoad={timeline.onContentLoad}
        onOpenThread={thread.open}
        onScroll={timeline.onScroll}
        onShowReplyTarget={onShowReplyTarget}
        timelineRef={timeline.ref}
      />

      <Composer
        activeRoomId={activeRoomId}
        composerMode={composer.mode}
        draft={composer.draft}
        setDraft={composer.setDraft}
        pendingFiles={composer.pendingFiles}
        setPendingFiles={composer.setPendingFiles}
        setComposerMode={composer.setMode}
        composerAction={composer.action}
        stampFolders={composer.stampFolders}
        stampUploading={composer.stampUploading}
        stamps={composer.stamps}
        mentionUsers={composer.mentionUsers}
        selectedStampIds={composer.selectedStampIds}
        onSubmit={composer.onSendMessage}
        onCancelReply={composer.onCancelReply}
        onClarifyDraft={composer.onClarifyDraft}
        onImproveDraft={composer.onImproveDraft}
        onReorderStamps={composer.onReorderStamps}
        onSendPeraichi={composer.onSendPeraichi}
        onToggleStamp={composer.onToggleStamp}
        onUploadInlineFile={composer.onUploadInlineFile}
        onUploadStampImage={composer.onUploadStampImage}
        replyTo={composer.replyTo}
      />
    </>
  );
}
