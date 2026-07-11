import type { UseRealtimeConnectionOptions } from "./realtimeConnectionTypes";
import type { createRealtimeRoomSync } from "./realtimeRoomSync";
import { getErrorMessage } from "./mutationRunner";

type RealtimeRoomSync = ReturnType<typeof createRealtimeRoomSync>;

type LoadRealtimeRoomInitialDataOptions = {
  activeRoomId: string;
  options: UseRealtimeConnectionOptions;
  roomSync: RealtimeRoomSync;
};

export function loadRealtimeRoomInitialData({ activeRoomId, options, roomSync }: LoadRealtimeRoomInitialDataOptions) {
  roomSync.fetchMessages().catch((err: unknown) => options.setError(getErrorMessage(err, "メッセージの取得に失敗しました")));
  roomSync.fetchTasks().catch((err: unknown) => options.setError(getErrorMessage(err, "タスク取得に失敗しました")));
  options.loadRoomMembers(activeRoomId).catch((err: unknown) => options.setError(getErrorMessage(err, "メンバー一覧の取得に失敗しました")));
  options.loadInvitations(activeRoomId).catch(() => undefined);
}
