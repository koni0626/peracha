import type { ReactNode } from "react";

import type { Stamp, User } from "../types";
import type { InlineUploadResult } from "./richEditorMedia";

export type RichMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  selectedStampIds?: string[];
  surfaceAccessory?: ReactNode;
  stamps?: Stamp[];
  onRemoveStamp?: (stampId: string) => void;
  onReorderStamps?: (stampIds: string[]) => void;
  toolbarExtra?: ReactNode;
  mentionUsers?: User[];
  onUploadInlineFile?: (file: File) => Promise<InlineUploadResult>;
  preferSavedSelectionOnImageDrop?: boolean;
};
