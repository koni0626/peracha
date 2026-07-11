import { useState } from "react";

export function usePerachaNotices() {
  const [chatNotice, setChatNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return {
    chatNotice,
    error,
    notices: { chatNotice, error },
    setChatNotice,
    setError,
  };
}
