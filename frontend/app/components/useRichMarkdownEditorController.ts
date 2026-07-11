import { useState } from "react";

import type { RichMarkdownEditorProps } from "./richMarkdownEditorTypes";
import { buildRichMarkdownEditorController } from "./richMarkdownEditorControllerState";
import { useRichEditorCommands } from "./useRichEditorCommands";
import { useRichEditorContent } from "./useRichEditorContent";
import { useRichEditorKeyboard } from "./useRichEditorKeyboard";
import { useRichEditorMedia } from "./useRichEditorMedia";
import { useRichEditorMentions } from "./useRichEditorMentions";
import { useRichEditorSurfaceEvents } from "./useRichEditorSurfaceEvents";
import { useRichEditorTableCommands } from "./useRichEditorTableCommands";
import { useRichEditorValueSync } from "./useRichEditorValueSync";

export function useRichMarkdownEditorController({
  value,
  onChange,
  selectedStampIds = [],
  stamps = [],
  onRemoveStamp,
  onReorderStamps,
  mentionUsers = [],
  onUploadInlineFile,
  preferSavedSelectionOnImageDrop = false,
}: RichMarkdownEditorProps) {
  const [tableEditing, setTableEditing] = useState(false);
  const content = useRichEditorContent({ onChange, value });
  const mentions = useRichEditorMentions({
    editorRef: content.editorRef,
    mentionUsers,
    selectAfter: content.selectAfter,
    syncMarkdown: content.syncMarkdown,
  });
  const media = useRichEditorMedia({
    editorRef: content.editorRef,
    onRemoveStamp,
    onReorderStamps,
    onUploadInlineFile,
    preferSavedSelectionOnImageDrop,
    savedBlockPositionRef: content.savedBlockPositionRef,
    savedRangeRef: content.savedRangeRef,
    savedTextOffsetRef: content.savedTextOffsetRef,
    selectedStampIds,
    selectAfter: content.selectAfter,
    stamps,
    syncMarkdown: content.syncMarkdown,
    unlockSelectionSaveSoon: content.unlockSelectionSaveSoon,
  });
  const tableCommands = useRichEditorTableCommands({
    editorRef: content.editorRef,
    savedRangeRef: content.savedRangeRef,
    setTableEditing,
    syncMarkdown: content.syncMarkdown,
  });
  const keyboard = useRichEditorKeyboard({
    closeMentionSuggestions: mentions.closeMentionSuggestions,
    editorRef: content.editorRef,
    handleMentionKeyDown: mentions.handleMentionKeyDown,
    mentionQuery: mentions.mentionQuery,
    saveSelection: content.saveSelection,
    savedRangeRef: content.savedRangeRef,
    syncMarkdown: content.syncMarkdown,
    updateTableEditingState: tableCommands.updateTableEditingState,
  });
  const commands = useRichEditorCommands({
    editorRef: content.editorRef,
    syncMarkdown: content.syncMarkdown,
  });
  const surfaceEvents = useRichEditorSurfaceEvents({
    lockSelectionSave: content.lockSelectionSave,
    onUploadInlineFile,
    saveSelection: content.saveSelection,
    syncMarkdown: content.syncMarkdown,
    updateMentionState: mentions.updateMentionState,
    uploadInlineFilesAtSelection: media.uploadInlineFilesAtSelection,
  });

  useRichEditorValueSync({
    closeMentionSuggestions: mentions.closeMentionSuggestions,
    ensureEditorHtml: content.ensureEditorHtml,
    syncExternalValue: content.syncExternalValue,
    value,
  });

  return buildRichMarkdownEditorController({
    commands,
    content,
    keyboard,
    media,
    mentions,
    surfaceEvents,
    tableCommands,
    tableEditing,
  });
}
