"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { Message } from "../types";

const BOTTOM_THRESHOLD_PX = 80;
const INITIAL_SCROLL_DELAYS_MS = [0, 50, 150, 350, 700, 1200];

type UseTimelineAutoScrollOptions = {
  activeRoomId: string | null;
  currentUserId: string | null;
  messages: Message[];
};

export function useTimelineAutoScroll({ activeRoomId, currentUserId, messages }: UseTimelineAutoScrollOptions) {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const didInitialScrollRef = useRef(false);
  const initialScrollTimersRef = useRef<number[]>([]);
  const lastActiveRoomIdRef = useRef<string | null>(null);
  const lastOwnMessageScrollIdRef = useRef<string | null>(null);

  function clearInitialScrollTimers() {
    for (const timer of initialScrollTimersRef.current) {
      window.clearTimeout(timer);
    }
    initialScrollTimersRef.current = [];
  }

  function scrollToBottom(behavior: ScrollBehavior = "auto") {
    const timeline = timelineRef.current;
    if (!timeline) {
      return;
    }
    if (behavior === "auto") {
      timeline.scrollTop = timeline.scrollHeight;
      return;
    }
    timeline.scrollTo({ top: timeline.scrollHeight, behavior });
  }

  function scheduleInitialScrollSettle() {
    clearInitialScrollTimers();
    initialScrollTimersRef.current = INITIAL_SCROLL_DELAYS_MS.map((delay) =>
      window.setTimeout(() => {
        if (shouldAutoScrollRef.current) {
          scrollToBottom();
        }
      }, delay)
    );
  }

  useEffect(() => clearInitialScrollTimers, []);

  useLayoutEffect(() => {
    if (lastActiveRoomIdRef.current !== activeRoomId) {
      clearInitialScrollTimers();
      shouldAutoScrollRef.current = true;
      didInitialScrollRef.current = false;
      lastActiveRoomIdRef.current = activeRoomId;
    }
    const timeline = timelineRef.current;
    const lastMessage = messages.at(-1);
    if (!timeline || !lastMessage || lastMessage.room_id !== activeRoomId) {
      return;
    }
    const isOwnLastMessage = Boolean(currentUserId && lastMessage.sender_user_id === currentUserId);
    if (!didInitialScrollRef.current) {
      didInitialScrollRef.current = true;
      shouldAutoScrollRef.current = true;
      lastOwnMessageScrollIdRef.current = isOwnLastMessage ? lastMessage.id : null;
      scrollToBottom();
      scheduleInitialScrollSettle();
      return;
    }
    if (isOwnLastMessage && lastOwnMessageScrollIdRef.current !== lastMessage.id) {
      lastOwnMessageScrollIdRef.current = lastMessage.id;
      shouldAutoScrollRef.current = true;
      scrollToBottom("smooth");
      scheduleInitialScrollSettle();
      return;
    }
    if (!shouldAutoScrollRef.current) {
      return;
    }
    scrollToBottom("smooth");
  }, [activeRoomId, messages]);

  function handleTimelineScroll() {
    const timeline = timelineRef.current;
    if (!timeline) {
      return;
    }
    const distanceFromBottom = timeline.scrollHeight - timeline.scrollTop - timeline.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < BOTTOM_THRESHOLD_PX;
  }

  function handleTimelineContentLoad() {
    if (!shouldAutoScrollRef.current) {
      return;
    }
    window.requestAnimationFrame(() => {
      if (shouldAutoScrollRef.current) {
        scrollToBottom();
      }
    });
  }

  return {
    handleTimelineContentLoad,
    handleTimelineScroll,
    timelineRef,
  };
}
