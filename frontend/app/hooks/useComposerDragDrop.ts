"use client";

import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";

type UseComposerDragDropOptions = {
  activeRoomId: string | null;
  addFiles: (files: File[]) => void;
};

export function useComposerDragDrop({ activeRoomId, addFiles }: UseComposerDragDropOptions) {
  const [dragActive, setDragActive] = useState(false);
  const dragDepthRef = useRef(0);

  function resetDragState() {
    dragDepthRef.current = 0;
    setDragActive(false);
  }

  useEffect(() => {
    window.addEventListener("drop", resetDragState, true);
    window.addEventListener("dragend", resetDragState, true);
    return () => {
      window.removeEventListener("drop", resetDragState, true);
      window.removeEventListener("dragend", resetDragState, true);
    };
  }, []);

  function handleDrag(event: DragEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!activeRoomId) {
      return;
    }
    if (event.type === "dragenter") {
      dragDepthRef.current += 1;
      setDragActive(true);
    }
    if (event.type === "dragover") {
      setDragActive(true);
    }
    if (event.type === "dragleave") {
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      setDragActive(dragDepthRef.current > 0);
    }
  }

  function handleDrop(event: DragEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    resetDragState();
    if (!activeRoomId) {
      return;
    }
    addFiles(Array.from(event.dataTransfer.files ?? []));
  }

  return {
    dragActive,
    handleDrag,
    handleDrop,
  };
}
