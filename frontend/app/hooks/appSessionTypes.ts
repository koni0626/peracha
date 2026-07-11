import type { Dispatch, SetStateAction } from "react";

import type { useAppSessionState } from "./useAppSessionState";
import type { useAuthFormState } from "./useAuthFormState";

export type AppSessionOptions = {
  setError: Dispatch<SetStateAction<string | null>>;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
};

export type AppSessionActionOptions = {
  authForm: ReturnType<typeof useAuthFormState>;
  sessionState: ReturnType<typeof useAppSessionState>;
  setError: Dispatch<SetStateAction<string | null>>;
};
