type UseRealtimeResetOptions = {
  resetRealtimeMessages: () => void;
  resetRoomIndicators: () => void;
  setConnection: (connection: "offline") => void;
};

export function useRealtimeReset({
  resetRealtimeMessages,
  resetRoomIndicators,
  setConnection,
}: UseRealtimeResetOptions) {
  function resetRealtimeState() {
    resetRealtimeMessages();
    resetRoomIndicators();
    setConnection("offline");
  }

  return { resetRealtimeState };
}
