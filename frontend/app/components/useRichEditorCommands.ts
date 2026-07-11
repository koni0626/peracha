import type { RefObject } from "react";

import { safeHref } from "./richMarkdownTransforms";

const DEFAULT_TABLE_HTML =
  "<table><thead><tr><th>項目</th><th>内容</th><th>状態</th></tr></thead><tbody><tr><td>例</td><td>説明</td><td>未確認</td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>";

type UseRichEditorCommandsOptions = {
  editorRef: RefObject<HTMLDivElement | null>;
  syncMarkdown: () => void;
};

export function useRichEditorCommands({ editorRef, syncMarkdown }: UseRichEditorCommandsOptions) {
  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncMarkdown();
  }

  function insertTable() {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, DEFAULT_TABLE_HTML);
    syncMarkdown();
  }

  function insertLink() {
    const href = window.prompt("URL", "https://example.com");
    if (!href) {
      return;
    }
    runCommand("createLink", safeHref(href));
  }

  return { insertLink, insertTable, runCommand };
}
