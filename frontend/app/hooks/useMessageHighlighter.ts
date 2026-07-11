import type { RefObject } from "react";

export function useMessageHighlighter(timelineRef: RefObject<HTMLDivElement | null>) {
  function showMessage(messageId: string) {
    const target = timelineRef.current?.querySelector<HTMLElement>(`[data-message-id="${CSS.escape(messageId)}"]`);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("isHighlighted");
    window.setTimeout(() => target.classList.remove("isHighlighted"), 1400);
  }

  return { showMessage };
}
