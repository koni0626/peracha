import type { ComponentProps } from "react";

import type { AuthenticatedAppShell } from "../components/AuthenticatedAppShell";
import type { AuthScreen } from "../components/AuthScreen";
import type { User } from "../types";

export type UsePerachaAppResult = {
  authScreen: ComponentProps<typeof AuthScreen>;
  shell: ComponentProps<typeof AuthenticatedAppShell> | null;
  user: User | null;
};
