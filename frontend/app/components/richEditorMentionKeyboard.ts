import type { KeyboardEvent } from "react";

import type { User } from "../types";

type HandleMentionKeyDownOptions = {
  candidates: User[];
  highlightedIndex: number;
  mentionQuery: string | null;
  closeMentionSuggestions: () => void;
  insertMention: (user: User) => void;
  setMentionIndex: (updater: (current: number) => number) => void;
};

export function handleMentionSuggestionKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  {
    candidates,
    highlightedIndex,
    mentionQuery,
    closeMentionSuggestions,
    insertMention,
    setMentionIndex,
  }: HandleMentionKeyDownOptions
) {
  if (mentionQuery === null) {
    return false;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeMentionSuggestions();
    return true;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    setMentionIndex((current) => Math.min(current + 1, Math.max(candidates.length - 1, 0)));
    return true;
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    setMentionIndex((current) => Math.max(current - 1, 0));
    return true;
  }
  if ((event.key === "Enter" || event.key === "Tab") && candidates.length > 0) {
    event.preventDefault();
    insertMention(candidates[Math.min(highlightedIndex, candidates.length - 1)]);
    return true;
  }
  return false;
}
