"use client";

import { createAuthenticatedShellProps, createAuthScreenProps } from "./perachaAppProps";
import type { UsePerachaAppResult } from "./perachaAppResultTypes";
import { useAppSession } from "./useAppSession";
import { useFacilitatorTools } from "./useFacilitatorTools";
import { usePerachaAuthActions } from "./usePerachaAuthActions";
import { usePerachaComposerState } from "./usePerachaComposerState";
import { usePerachaMessageComposer } from "./usePerachaMessageComposer";
import { usePerachaNotices } from "./usePerachaNotices";
import { usePerachaRealtimeChat } from "./usePerachaRealtimeChat";
import { usePerachaRoomManagement } from "./usePerachaRoomManagement";
import { useRoomAccess } from "./useRoomAccess";
import { useRoomFiles } from "./useRoomFiles";
import { useStampManager } from "./useStampManager";
import { useTimelineAutoScroll } from "./useTimelineAutoScroll";

export function usePerachaApp(): UsePerachaAppResult {
  const { chatNotice, error, notices, setChatNotice, setError } = usePerachaNotices();
  const session = useAppSession({ setError, setChatNotice });
  const composerState = usePerachaComposerState(session.activeRoomId);

  const access = useRoomAccess({
    activeRoomId: session.activeRoomId,
    setActiveRoomId: session.setActiveRoomId,
    setError,
    setRooms: session.setRooms,
  });

  const facilitator = useFacilitatorTools({
    activeRoomId: session.activeRoomId,
    draft: composerState.draft,
    setDraft: composerState.setDraft,
    setChatNotice,
    setError
  });

  const realtime = usePerachaRealtimeChat({
    access,
    facilitator,
    session,
    setChatNotice,
    setError,
  });

  const management = usePerachaRoomManagement({
    access,
    facilitator,
    realtime,
    session,
    setChatNotice,
    setError,
  });

  const files = useRoomFiles({
    activeRoomId: session.activeRoomId,
    setActiveRoomId: session.setActiveRoomId,
    setError,
    setRoomContextMenu: management.setRoomContextMenu,
  });

  const stamps = useStampManager({
    activeRoomId: session.activeRoomId,
    setError,
    userId: session.user?.id ?? null
  });

  const composer = usePerachaMessageComposer({
    composerState,
    files,
    realtime,
    session,
    setError,
    stamps,
  });

  const timeline = useTimelineAutoScroll({
    activeRoomId: session.activeRoomId,
    currentUserId: session.user?.id ?? null,
    messages: realtime.messages,
  });
  const { auth, logout } = usePerachaAuthActions({ access, facilitator, realtime, session, setError });

  const authScreen = createAuthScreenProps({
    error,
    onSubmit: auth.submitAuth,
    session,
  });

  const shell = createAuthenticatedShellProps({
    access,
    composer,
    composerState,
    facilitator,
    files,
    logout: logout.logout,
    management,
    notices,
    realtime,
    session,
    setError,
    stamps,
    timeline,
  });

  return { authScreen, shell, user: session.user };
}
