import type { Dispatch, SetStateAction } from "react";

import type { AppSession, FacilitatorTools, RealtimeChat, RoomAccess } from "./perachaAppTypes";
import { useAuthFlow } from "./useAuthFlow";
import { useLogoutFlow } from "./useLogoutFlow";

type UsePerachaAuthActionsOptions = {
  access: RoomAccess;
  facilitator: FacilitatorTools;
  realtime: RealtimeChat;
  session: AppSession;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function usePerachaAuthActions({
  access,
  facilitator,
  realtime,
  session,
  setError,
}: UsePerachaAuthActionsOptions) {
  const auth = useAuthFlow({
    acceptInvitationToken: access.acceptInvitationToken,
    acceptToken: access.acceptToken,
    authenticate: session.authenticate,
    setAcceptToken: access.setAcceptToken,
    setAuthMode: session.setAuthMode,
    setError,
  });
  const logout = useLogoutFlow({
    closeConnection: realtime.closeConnection,
    logoutSession: session.logoutSession,
    resetAccessState: access.resetAccessState,
    resetFacilitatorState: facilitator.resetFacilitatorState,
    resetRealtimeState: realtime.resetRealtimeState,
    resetMessages: () => realtime.setMessages([]),
  });

  return { auth, logout };
}
