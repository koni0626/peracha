"use client";

import { AuthenticatedAppShell } from "./components/AuthenticatedAppShell";
import { AuthScreen } from "./components/AuthScreen";
import { usePerachaApp } from "./hooks/usePerachaApp";

export default function Home() {
  const { authScreen, shell, user } = usePerachaApp();

  if (!user || !shell) {
    return <AuthScreen {...authScreen} />;
  }

  return <AuthenticatedAppShell {...shell} />;
}
