import { useEffect, useRef } from "react";

export function useLatestValueRef<T>(value: T) {
  const latestValueRef = useRef(value);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  return latestValueRef;
}
