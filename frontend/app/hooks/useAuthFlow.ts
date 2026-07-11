"use client";

import { FormEvent, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

import { getErrorMessage } from "./mutationRunner";

type AuthMode = "login" | "register";

type UseAuthFlowOptions = {
  acceptInvitationToken: (token: string) => Promise<void>;
  acceptToken: string;
  authenticate: () => Promise<void>;
  setAcceptToken: (token: string) => void;
  setAuthMode: Dispatch<SetStateAction<AuthMode>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useAuthFlow({
  acceptInvitationToken,
  acceptToken,
  authenticate,
  setAcceptToken,
  setAuthMode,
  setError
}: UseAuthFlowOptions) {
  useEffect(() => {
    const inviteToken = new URLSearchParams(window.location.search).get("invite_token");
    if (inviteToken) {
      setAcceptToken(inviteToken);
      setAuthMode("login");
    }
  }, [setAcceptToken, setAuthMode]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await authenticate();
      if (acceptToken.trim()) {
        await acceptInvitationToken(acceptToken.trim());
      }
    } catch (err) {
      setError(getErrorMessage(err, "認証に失敗しました"));
    }
  }

  return {
    submitAuth
  };
}
