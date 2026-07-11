import { getErrorMessage } from "./mutationRunner";

export function reportRealtimeError(setError: (message: string | null) => void, fallbackError: string) {
  return (err: unknown) => {
    setError(getErrorMessage(err, fallbackError));
  };
}
