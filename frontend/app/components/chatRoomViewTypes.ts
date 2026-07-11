import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";

import type { Message, RelatedContext, Room, RoomFile, RoomMember, Stamp, StampFolder, User } from "../types";

export type ChatRoomComposerProps = {
  action: "ai" | "clarify" | "peraichi" | "send" | null;
  draft: string;
  mode: "docked" | "floating";
  mentionUsers: User[];
  onCancelReply: () => void;
  onClarifyDraft: () => void | Promise<void>;
  onImproveDraft: () => void | Promise<void>;
  onReplyToMessage: (message: Message) => void;
  onReorderStamps: (stampIds: string[]) => void;
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onSendPeraichi: () => void | Promise<void>;
  onToggleStamp: (stampId: string) => void;
  onUploadInlineFile: (file: File) => Promise<{ title: string; url: string; content_type: string | null }>;
  onUploadStampImage: (file: File, folderId?: string | null) => void | Promise<void>;
  pendingFiles: File[];
  replyTo: Message | null;
  selectedStampIds: string[];
  setDraft: Dispatch<SetStateAction<string>>;
  setMode: Dispatch<SetStateAction<"docked" | "floating">>;
  setPendingFiles: Dispatch<SetStateAction<File[]>>;
  stampFolders: StampFolder[];
  stampUploading: boolean;
  stamps: Stamp[];
};

export type ChatRoomContextSearchProps = {
  loading: boolean;
  query: string;
  results: RelatedContext[];
  search: (event?: FormEvent<HTMLFormElement>) => void;
  setQuery: (value: string) => void;
};

export type ChatRoomNoticesProps = {
  chatNotice: string | null;
  error: string | null;
};

export type ChatRoomRoomProps = {
  activeRoom: Room;
  activeRoomId: string | null;
  loadRoomFiles: (roomId?: string | null) => Promise<void>;
  members: RoomMember[];
  onOpenFolder: (roomId: string) => void | Promise<void>;
  onOpenRoomEditor: (roomId: string) => void | Promise<void>;
  uploadRoomFile: (file: File, roomId?: string | null) => Promise<RoomFile>;
};

export type ChatRoomTimelineProps = {
  messages: Message[];
  onContentLoad: () => void;
  onScroll: () => void;
  ref: RefObject<HTMLDivElement | null>;
};
