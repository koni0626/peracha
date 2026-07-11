import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Message, Stamp, StampFolder, User } from "../types";
import { ThreadComposer } from "./ThreadComposer";
import { ThreadPanelHeader } from "./ThreadPanelHeader";
import { ThreadMessageList } from "./ThreadMessageList";

type ThreadPanelProps = {
  activeRoomId: string | null;
  draft: string;
  loading: boolean;
  mentionUsers: User[];
  messages: Message[];
  onClose: () => void;
  onSend: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onToggleStamp: (stampId: string) => void;
  onUploadInlineFile: (file: File) => Promise<{ title: string; url: string; content_type: string | null }>;
  onUploadStampImage: (file: File, folderId?: string | null) => void | Promise<void>;
  pendingFiles: File[];
  rootMessage: Message;
  selectedStampIds: string[];
  sending: boolean;
  setDraft: Dispatch<SetStateAction<string>>;
  setPendingFiles: Dispatch<SetStateAction<File[]>>;
  setSelectedStampIds: Dispatch<SetStateAction<string[]>>;
  stampFolders: StampFolder[];
  stampUploading: boolean;
  stamps: Stamp[];
};

export function ThreadPanel({
  activeRoomId,
  draft,
  loading,
  mentionUsers,
  messages,
  onClose,
  onSend,
  onToggleStamp,
  onUploadInlineFile,
  onUploadStampImage,
  pendingFiles,
  rootMessage,
  selectedStampIds,
  sending,
  setDraft,
  setPendingFiles,
  setSelectedStampIds,
  stampFolders,
  stampUploading,
  stamps,
}: ThreadPanelProps) {
  return (
    <aside className="threadPanel">
      <ThreadPanelHeader replyCount={messages.length} onClose={onClose} />

      <ThreadMessageList loading={loading} messages={messages} rootMessage={rootMessage} />

      <ThreadComposer
        activeRoomId={activeRoomId}
        draft={draft}
        mentionUsers={mentionUsers}
        onSend={onSend}
        onToggleStamp={onToggleStamp}
        onUploadInlineFile={onUploadInlineFile}
        onUploadStampImage={onUploadStampImage}
        pendingFiles={pendingFiles}
        selectedStampIds={selectedStampIds}
        sending={sending}
        setDraft={setDraft}
        setPendingFiles={setPendingFiles}
        setSelectedStampIds={setSelectedStampIds}
        stampFolders={stampFolders}
        stampUploading={stampUploading}
        stamps={stamps}
      />
    </aside>
  );
}
