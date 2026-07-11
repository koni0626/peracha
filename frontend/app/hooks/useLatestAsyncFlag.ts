import { useRef, useState } from "react";

export function useLatestAsyncFlag() {
  const [active, setActive] = useState(false);
  const requestIdRef = useRef(0);

  function begin() {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setActive(true);
    return requestId;
  }

  function finish(requestId: number) {
    if (requestIdRef.current === requestId) {
      setActive(false);
    }
  }

  return {
    active,
    begin,
    finish,
  };
}
