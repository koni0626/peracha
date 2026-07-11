"use client";

import type { AppSessionOptions } from "./appSessionTypes";
import { useAuthFormState } from "./useAuthFormState";
import { useAuthLostListener } from "./useAuthLostListener";
import { useAppSessionState } from "./useAppSessionState";
import { useAppSessionActions } from "./useAppSessionActions";
import { useAvatarUpload } from "./useAvatarUpload";
import { useSessionRoomSync } from "./useSessionRoomSync";

export function useAppSession({ setError, setChatNotice }: AppSessionOptions) {
  const authForm = useAuthFormState();
  const sessionState = useAppSessionState({ setChatNotice });
  const { uploadAvatar } = useAvatarUpload({ setChatNotice, setError, setUser: sessionState.setUser });
  const sessionActions = useAppSessionActions({ authForm, sessionState, setError });

  useAuthLostListener({ resetSessionState: sessionState.resetSessionState, setAuthMode: authForm.setAuthMode, setError });
  useSessionRoomSync({
    applySession: sessionState.applySession,
    handleAuthenticationLost: sessionActions.handleAuthenticationLost,
    userId: sessionState.user?.id,
  });

  return {
    activeRoomId: sessionState.activeRoomId,
    activeRoomIdRef: sessionState.activeRoomIdRef,
    authMode: authForm.authMode,
    email: authForm.email,
    homeRoomId: sessionState.homeRoomId,
    name: authForm.name,
    password: authForm.password,
    rooms: sessionState.rooms,
    roomsRef: sessionState.roomsRef,
    user: sessionState.user,
    authenticate: sessionActions.authenticate,
    logoutSession: sessionActions.logoutSession,
    resetSessionState: sessionState.resetSessionState,
    setActiveRoomId: sessionState.setActiveRoomId,
    setAuthMode: authForm.setAuthMode,
    setEmail: authForm.setEmail,
    setHomeRoomId: sessionState.setHomeRoomId,
    setName: authForm.setName,
    setPassword: authForm.setPassword,
    setRooms: sessionState.setRooms,
    uploadAvatar
  };
}
