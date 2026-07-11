import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Message, Stamp, StampFolder, User } from "../types";
import type { ComposerAction, ComposerMode } from "./ComposerControls";

export type ComposerProps = {
  activeRoomId: string | null;
  composerMode: ComposerMode;
  draft: string;
  setDraft: Dispatch<SetStateAction<string>>;
  pendingFiles: File[];
  setPendingFiles: Dispatch<SetStateAction<File[]>>;
  setComposerMode: Dispatch<SetStateAction<ComposerMode>>;
  composerAction: ComposerAction;
  stampFolders: StampFolder[];
  stampUploading: boolean;
  stamps: Stamp[];
  mentionUsers: User[];
  selectedStampIds: string[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onCancelReply: () => void;
  onClarifyDraft: () => void | Promise<void>;
  onImproveDraft: () => void | Promise<void>;
  onReorderStamps: (stampIds: string[]) => void;
  onSendPeraichi: () => void | Promise<void>;
  onToggleStamp: (stampId: string) => void;
  onUploadInlineFile: (file: File) => Promise<{ title: string; url: string; content_type: string | null }>;
  onUploadStampImage: (file: File, folderId?: string | null) => void | Promise<void>;
  replyTo: Message | null;
};

export type ThreadComposerProps = {
  activeRoomId: string | null;
  draft: string;
  mentionUsers: User[];
  onSend: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onToggleStamp: (stampId: string) => void;
  onUploadInlineFile: (file: File) => Promise<{ title: string; url: string; content_type: string | null }>;
  onUploadStampImage: (file: File, folderId?: string | null) => void | Promise<void>;
  pendingFiles: File[];
  selectedStampIds: string[];
  sending: boolean;
  setDraft: Dispatch<SetStateAction<string>>;
  setPendingFiles: Dispatch<SetStateAction<File[]>>;
  setSelectedStampIds: Dispatch<SetStateAction<string[]>>;
  stampFolders: StampFolder[];
  stampUploading: boolean;
  stamps: Stamp[];
};
