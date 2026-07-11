import { loginSession, logoutCurrentSession, registerSession } from "./appSessionApi";
import { AUTH_LOST_MESSAGE, isAuthenticationError } from "./appSessionAuthState";
import type { AppSessionActionOptions } from "./appSessionTypes";

export function useAppSessionActions({ authForm, sessionState, setError }: AppSessionActionOptions) {
  async function authenticate() {
    setError(null);
    const data =
      authForm.authMode === "register"
        ? await registerSession({ name: authForm.name, email: authForm.email, password: authForm.password })
        : await loginSession({ email: authForm.email, password: authForm.password });
    sessionState.applySession(data, true);
  }

  function handleAuthenticationLost(err: unknown, showMessage = true) {
    if (!isAuthenticationError(err)) {
      return false;
    }
    sessionState.resetSessionState();
    authForm.setAuthMode("login");
    if (showMessage) {
      setError(AUTH_LOST_MESSAGE);
    }
    return true;
  }

  async function logoutSession() {
    setError(null);
    try {
      await logoutCurrentSession();
    } catch {
      // Cookie may already be invalid; the local UI should still return to auth.
    } finally {
      sessionState.resetSessionState();
    }
  }

  return {
    authenticate,
    handleAuthenticationLost,
    logoutSession,
  };
}
