import { ThreadPanel } from "./ThreadPanel";
import type { ChatRoomComposerProps } from "./chatRoomViewTypes";
import type { RoomViewKind } from "./roomViewTypes";
import type { useChatThread } from "../hooks/useChatThread";

type ChatRoomThreadAsideProps = {
  activeRoomId: string | null;
  activeView: RoomViewKind;
  composer: ChatRoomComposerProps;
  thread: ReturnType<typeof useChatThread>;
};

export function ChatRoomThreadAside({ activeRoomId, activeView, composer, thread }: ChatRoomThreadAsideProps) {
  if (!thread.root || activeView !== "chat") {
    return null;
  }

  return (
    <>
      <div
        className="threadResizeHandle"
        onPointerDown={thread.startResize}
        role="separator"
        aria-label="スレッド幅を変更"
        aria-orientation="vertical"
      />
      <ThreadPanel
        activeRoomId={activeRoomId}
        draft={thread.draft}
        loading={thread.loading}
        mentionUsers={composer.mentionUsers}
        messages={thread.messages}
        onClose={thread.close}
        onSend={thread.send}
        onToggleStamp={thread.toggleStamp}
        onUploadInlineFile={thread.uploadInlineFile}
        onUploadStampImage={composer.onUploadStampImage}
        pendingFiles={thread.pendingFiles}
        rootMessage={thread.root}
        selectedStampIds={thread.selectedStampIds}
        sending={thread.sending}
        setDraft={thread.setDraft}
        setPendingFiles={thread.setPendingFiles}
        setSelectedStampIds={thread.setSelectedStampIds}
        stampFolders={composer.stampFolders}
        stampUploading={composer.stampUploading}
        stamps={composer.stamps}
      />
    </>
  );
}
