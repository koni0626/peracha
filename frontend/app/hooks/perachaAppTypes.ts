import type { ComponentProps, Dispatch, SetStateAction } from "react";

import type { AuthenticatedAppShell } from "../components/AuthenticatedAppShell";
import type { AuthScreen } from "../components/AuthScreen";
import type { Message } from "../types";
import type { useAppSession } from "./useAppSession";
import type { useFacilitatorTools } from "./useFacilitatorTools";
import type { useMessageComposer } from "./useMessageComposer";
import type { useRealtimeChat } from "./useRealtimeChat";
import type { useRoomAccess } from "./useRoomAccess";
import type { useRoomFiles } from "./useRoomFiles";
import type { useRoomManagement } from "./useRoomManagement";
import type { useStampManager } from "./useStampManager";
import type { useTimelineAutoScroll } from "./useTimelineAutoScroll";

export type AuthScreenProps = ComponentProps<typeof AuthScreen>;
export type AuthenticatedShellProps = ComponentProps<typeof AuthenticatedAppShell>;
export type AppSession = ReturnType<typeof useAppSession>;
export type FacilitatorTools = ReturnType<typeof useFacilitatorTools>;
export type MessageComposer = ReturnType<typeof useMessageComposer>;
export type RealtimeChat = ReturnType<typeof useRealtimeChat>;
export type RoomAccess = ReturnType<typeof useRoomAccess>;
export type RoomFiles = ReturnType<typeof useRoomFiles>;
export type RoomManagement = ReturnType<typeof useRoomManagement>;
export type StampManager = ReturnType<typeof useStampManager>;
export type TimelineAutoScroll = ReturnType<typeof useTimelineAutoScroll>;

export type Notices = {
  chatNotice: string | null;
  error: string | null;
};

export type ComposerState = {
  draft: string;
  mode: "docked" | "floating";
  replyTo: Message | null;
  setDraft: Dispatch<SetStateAction<string>>;
  setMode: Dispatch<SetStateAction<"docked" | "floating">>;
  setReplyTo: Dispatch<SetStateAction<Message | null>>;
};

export type CreateAuthScreenPropsOptions = {
  error: string | null;
  onSubmit: AuthScreenProps["onSubmit"];
  session: AppSession;
};

export type CreateAuthenticatedShellPropsOptions = {
  access: RoomAccess;
  composer: MessageComposer;
  composerState: ComposerState;
  facilitator: FacilitatorTools;
  files: RoomFiles;
  logout: () => void;
  management: RoomManagement;
  notices: Notices;
  realtime: RealtimeChat;
  session: AppSession;
  setError: Dispatch<SetStateAction<string | null>>;
  stamps: StampManager;
  timeline: TimelineAutoScroll;
};

export type AuthenticatedPropsOptions = CreateAuthenticatedShellPropsOptions & {
  user: NonNullable<AppSession["user"]>;
};
