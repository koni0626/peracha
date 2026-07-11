"use client";

import { ApiIntegrationPanel } from "./ApiIntegrationPanel";
import { useApiIntegration } from "../hooks/useApiIntegration";

type ApiIntegrationSectionProps = {
  activeRoomId: string | null;
  setError: (message: string | null) => void;
};

export function ApiIntegrationSection({ activeRoomId, setError }: ApiIntegrationSectionProps) {
  const apiIntegration = useApiIntegration({ activeRoomId, setError });

  return <ApiIntegrationPanel activeRoomId={activeRoomId} {...apiIntegration} />;
}
