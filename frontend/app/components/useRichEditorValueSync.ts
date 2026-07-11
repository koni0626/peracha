import { useEffect } from "react";

type UseRichEditorValueSyncOptions = {
  closeMentionSuggestions: () => void;
  ensureEditorHtml: () => void;
  syncExternalValue: (onApplied?: () => void) => void;
  value: string;
};

export function useRichEditorValueSync({
  closeMentionSuggestions,
  ensureEditorHtml,
  syncExternalValue,
  value,
}: UseRichEditorValueSyncOptions) {
  useEffect(() => {
    syncExternalValue(closeMentionSuggestions);
  }, [value]);

  useEffect(() => {
    ensureEditorHtml();
  }, [value]);
}
