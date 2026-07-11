import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

import { AUTH_LOST_MESSAGE } from "./appSessionAuthState";

type AuthMode = "login" | "register";

type UseAuthLostListenerOptions = {
  resetSessionState: () => void;
  setAuthMode: Dispatch<SetStateAction<AuthMode>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useAuthLostListener({ resetSessionState, setAuthMode, setError }: UseAuthLostListenerOptions) {
  useEffect(() => {
    const handleAuthLost = () => {
      resetSessionState();
      setAuthMode("login");
      setError(AUTH_LOST_MESSAGE);
    };
    window.addEventListener("peracha:auth-lost", handleAuthLost);
    return () => window.removeEventListener("peracha:auth-lost", handleAuthLost);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
