import { useEffect } from "react";

import type { MeResponse } from "../types";
import { fetchCurrentSession } from "./appSessionApi";

type UseSessionRoomSyncOptions = {
  applySession: (data: MeResponse, selectFirst?: boolean) => void;
  handleAuthenticationLost: (err: unknown, showMessage?: boolean) => boolean;
  userId?: string;
};

export function useSessionRoomSync({ applySession, handleAuthenticationLost, userId }: UseSessionRoomSyncOptions) {
  useEffect(() => {
    fetchCurrentSession()
      .then((data) => applySession(data, true))
      .catch((err) => {
        handleAuthenticationLost(err, false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    let disposed = false;
    const syncRooms = () => {
      fetchCurrentSession()
        .then((data) => {
          if (!disposed) {
            applySession(data);
          }
        })
        .catch((err) => {
          if (!disposed) {
            handleAuthenticationLost(err);
          }
        });
    };
    const interval = window.setInterval(syncRooms, 5000);
    const handleFocus = () => syncRooms();
    window.addEventListener("focus", handleFocus);
    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
}
