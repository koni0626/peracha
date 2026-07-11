import type { ClipboardEvent, DragEvent, KeyboardEvent, ReactNode, RefObject } from "react";

import { handleInlineImageDragStart } from "./richEditorMedia";

type RichEditorSurfaceProps = {
  editorRef: RefObject<HTMLDivElement | null>;
  handleEditorDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  handleEditorDragOver: (event: DragEvent<HTMLDivElement>) => void;
  handleEditorDrop: (event: DragEvent<HTMLDivElement>) => void;
  handleEditorKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  handleEditorPaste: (event: ClipboardEvent<HTMLDivElement>) => void;
  placeholder: string;
  saveSelection: () => void;
  surfaceAccessory?: ReactNode;
  syncMarkdown: (formatEditor?: boolean) => void;
  updateMentionState: () => void;
  updateTableEditingState: () => void;
};

export function RichEditorSurface({
  editorRef,
  handleEditorDragEnter,
  handleEditorDragOver,
  handleEditorDrop,
  handleEditorKeyDown,
  handleEditorPaste,
  placeholder,
  saveSelection,
  surfaceAccessory,
  syncMarkdown,
  updateMentionState,
  updateTableEditingState,
}: RichEditorSurfaceProps) {
  function handleInput() {
    saveSelection();
    syncMarkdown();
    updateMentionState();
    updateTableEditingState();
  }

  function handleKeyUp() {
    saveSelection();
    updateTableEditingState();
  }

  function handleMouseUp() {
    saveSelection();
    updateMentionState();
    updateTableEditingState();
  }

  return (
    <div
      className="richEditorBody"
      onDragEnter={handleEditorDragEnter}
      onDragOver={handleEditorDragOver}
      onDrop={handleEditorDrop}
    >
      <div
        aria-label={placeholder}
        className="richEditorSurface"
        contentEditable
        data-placeholder={placeholder}
        onBlur={() => syncMarkdown()}
        onDragStart={(event) => handleInlineImageDragStart(event.nativeEvent, editorRef.current)}
        onInput={handleInput}
        onKeyDown={handleEditorKeyDown}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        onPaste={handleEditorPaste}
        ref={editorRef}
        role="textbox"
        suppressContentEditableWarning
      />
      {surfaceAccessory ? <div className="richEditorAccessory">{surfaceAccessory}</div> : null}
    </div>
  );
}
