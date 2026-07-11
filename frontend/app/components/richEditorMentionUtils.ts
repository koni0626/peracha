import type { User } from "../types";
import { rangeFromTextOffsets } from "./richEditorDom";

export type ActiveMentionMatch = {
  query: string;
  range: Range | null;
};

export function activeMentionMatch(editor: HTMLElement, selection: Selection | null): ActiveMentionMatch | null {
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!range.collapsed || !editor.contains(range.commonAncestorContainer)) {
    return null;
  }

  const beforeCaret = range.cloneRange();
  beforeCaret.selectNodeContents(editor);
  beforeCaret.setEnd(range.endContainer, range.endOffset);
  const textBeforeCaret = beforeCaret.toString();
  const match = /(^|\s)@([^\s@]*)$/.exec(textBeforeCaret);
  if (!match) {
    return null;
  }

  const query = match[2];
  const mentionStart = textBeforeCaret.length - query.length - 1;
  return {
    query,
    range: rangeFromTextOffsets(editor, mentionStart, textBeforeCaret.length),
  };
}

export function mentionCandidatesForQuery(mentionUsers: User[], mentionQuery: string | null) {
  if (mentionQuery === null) {
    return [];
  }
  const query = mentionQuery.toLowerCase();
  return mentionUsers
    .filter((user) => {
      const aliases = [user.name, user.email, user.email.split("@", 1)[0]].map((alias) => alias.toLowerCase());
      return aliases.some((alias) => alias.includes(query));
    })
    .slice(0, 8);
}

export function createMentionToken(user: User) {
  const mentionToken = document.createElement("span");
  mentionToken.className = "editorMentionToken";
  mentionToken.contentEditable = "false";
  mentionToken.dataset.userId = user.id;
  mentionToken.textContent = `@${user.name}`;
  return mentionToken;
}
