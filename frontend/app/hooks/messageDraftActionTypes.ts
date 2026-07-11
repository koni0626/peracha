import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import type { Attachment, Message } from "../types";

export type MessageDraftActionOptions = {
  activeRoomId: string | null;
  latestDraftRef: MutableRefObject<string>;
  postMessage: (body: string, extraAttachments?: Attachment[]) => Promise<Message | null>;
  sending: boolean;
  setDraft: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string | null>>;
};
