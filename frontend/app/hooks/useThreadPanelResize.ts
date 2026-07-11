import { useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export function useThreadPanelResize(initialWidth = 380) {
  const [width, setWidth] = useState(initialWidth);

  function startResize(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = width;
    const maxWidth = Math.min(620, Math.max(320, window.innerWidth - 520));

    function handlePointerMove(pointerEvent: PointerEvent) {
      const nextWidth = startWidth + startX - pointerEvent.clientX;
      setWidth(Math.min(maxWidth, Math.max(320, nextWidth)));
    }

    function stopResize() {
      document.body.classList.remove("isResizingThread");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    }

    document.body.classList.add("isResizingThread");
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
  }

  return {
    startResize,
    width,
  };
}
