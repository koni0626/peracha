"use client";

type UseLogoutFlowOptions = {
  closeConnection: () => void;
  logoutSession: () => Promise<void>;
  resetAccessState: () => void;
  resetFacilitatorState: () => void;
  resetRealtimeState: () => void;
  resetMessages: () => void;
};

export function useLogoutFlow({
  closeConnection,
  logoutSession,
  resetAccessState,
  resetFacilitatorState,
  resetRealtimeState,
  resetMessages,
}: UseLogoutFlowOptions) {
  function resetFeatureState() {
    resetMessages();
    resetFacilitatorState();
    resetAccessState();
    resetRealtimeState();
  }

  async function logout() {
    closeConnection();
    resetFeatureState();
    await logoutSession();
  }

  return {
    logout,
  };
}
