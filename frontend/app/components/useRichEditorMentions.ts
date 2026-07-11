import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";

import type { User } from "../types";
import { handleMentionSuggestionKeyDown } from "./richEditorMentionKeyboard";
import { insertMentionToken } from "./richEditorMentionInsert";
import { activeMentionMatch, mentionCandidatesForQuery } from "./richEditorMentionUtils";

type UseRichEditorMentionsOptions = {
  editorRef: RefObject<HTMLDivElement | null>;
  mentionUsers: User[];
  selectAfter: (node: Node) => void;
  syncMarkdown: () => void;
};

export function useRichEditorMentions({
  editorRef,
  mentionUsers,
  selectAfter,
  syncMarkdown,
}: UseRichEditorMentionsOptions) {
  const mentionRangeRef = useRef<Range | null>(null);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);

  const mentionCandidates = useMemo(
    () => mentionCandidatesForQuery(mentionUsers, mentionQuery),
    [mentionQuery, mentionUsers]
  );

  function closeMentionSuggestions() {
    mentionRangeRef.current = null;
    setMentionQuery(null);
    setMentionIndex(0);
  }

  function updateMentionState() {
    const editor = editorRef.current;
    if (!editor) {
      closeMentionSuggestions();
      return;
    }
    const match = activeMentionMatch(editor, window.getSelection());
    if (!match) {
      closeMentionSuggestions();
      return;
    }

    mentionRangeRef.current = match.range;
    setMentionQuery(match.query);
    setMentionIndex(0);
  }

  function insertMention(user: User) {
    if (
      !insertMentionToken({
        editor: editorRef.current,
        range: mentionRangeRef.current,
        selectAfter,
        user,
      })
    ) {
      return;
    }
    closeMentionSuggestions();
    syncMarkdown();
  }

  function handleMentionKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    return handleMentionSuggestionKeyDown(event, {
      candidates: mentionCandidates,
      highlightedIndex: mentionIndex,
      mentionQuery,
      closeMentionSuggestions,
      insertMention,
      setMentionIndex,
    });
  }

  return {
    closeMentionSuggestions,
    handleMentionKeyDown,
    insertMention,
    mentionCandidates,
    mentionIndex,
    mentionQuery,
    updateMentionState,
  };
}
