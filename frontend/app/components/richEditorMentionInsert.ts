import type { User } from "../types";
import { createMentionToken } from "./richEditorMentionUtils";

type InsertMentionTokenOptions = {
  editor: HTMLElement | null;
  range: Range | null;
  selectAfter: (node: Node) => void;
  user: User;
};

export function insertMentionToken({ editor, range, selectAfter, user }: InsertMentionTokenOptions) {
  if (!editor || !range) {
    return false;
  }
  editor.focus();
  range.deleteContents();
  const mentionToken = createMentionToken(user);
  const spacer = document.createTextNode(" ");
  range.insertNode(spacer);
  range.insertNode(mentionToken);
  selectAfter(spacer);
  return true;
}
