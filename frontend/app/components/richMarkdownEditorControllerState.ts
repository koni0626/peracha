import type { useRichEditorCommands } from "./useRichEditorCommands";
import type { useRichEditorContent } from "./useRichEditorContent";
import type { useRichEditorKeyboard } from "./useRichEditorKeyboard";
import type { useRichEditorMedia } from "./useRichEditorMedia";
import type { useRichEditorMentions } from "./useRichEditorMentions";
import type { useRichEditorSurfaceEvents } from "./useRichEditorSurfaceEvents";
import type { useRichEditorTableCommands } from "./useRichEditorTableCommands";

type BuildRichMarkdownEditorControllerOptions = {
  commands: ReturnType<typeof useRichEditorCommands>;
  content: ReturnType<typeof useRichEditorContent>;
  keyboard: ReturnType<typeof useRichEditorKeyboard>;
  media: ReturnType<typeof useRichEditorMedia>;
  mentions: ReturnType<typeof useRichEditorMentions>;
  surfaceEvents: ReturnType<typeof useRichEditorSurfaceEvents>;
  tableCommands: ReturnType<typeof useRichEditorTableCommands>;
  tableEditing: boolean;
};

export function buildRichMarkdownEditorController({
  commands,
  content,
  keyboard,
  media,
  mentions,
  surfaceEvents,
  tableCommands,
  tableEditing,
}: BuildRichMarkdownEditorControllerOptions) {
  return {
    mentionSuggestions: {
      candidates: mentions.mentionCandidates,
      highlightedIndex: mentions.mentionIndex,
      onSelect: mentions.insertMention,
      visible: mentions.mentionQuery !== null,
    },
    surface: {
      editorRef: content.editorRef,
      handleEditorDragEnter: surfaceEvents.handleEditorDragEnter,
      handleEditorDragOver: surfaceEvents.handleEditorDragOver,
      handleEditorDrop: media.handleEditorDrop,
      handleEditorKeyDown: keyboard.handleEditorKeyDown,
      handleEditorPaste: surfaceEvents.handleEditorPaste,
      saveSelection: content.saveSelection,
      syncMarkdown: content.syncMarkdown,
      updateMentionState: mentions.updateMentionState,
      updateTableEditingState: tableCommands.updateTableEditingState,
    },
    toolbar: {
      onEditTable: tableCommands.editTable,
      onInsertLink: commands.insertLink,
      onInsertTable: commands.insertTable,
      onRunCommand: commands.runCommand,
      tableEditing,
    },
  };
}
