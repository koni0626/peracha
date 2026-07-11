import { Send } from "lucide-react";

import { useComposerSurfaceState } from "../hooks/useComposerSurfaceState";
import { ComposerStampPicker } from "./ComposerStampPicker";
import { ComposerStampToolbarButton } from "./ComposerStampToolbarButton";
import type { ThreadComposerProps } from "./composerTypes";
import { PendingAttachments } from "./PendingAttachments";
import { RichMarkdownEditor } from "./RichMarkdownEditor";

export function ThreadComposer({
  activeRoomId,
  draft,
  mentionUsers,
  onSend,
  onToggleStamp,
  onUploadInlineFile,
  onUploadStampImage,
  pendingFiles,
  selectedStampIds,
  sending,
  setDraft,
  setPendingFiles,
  setSelectedStampIds,
  stampFolders,
  stampUploading,
  stamps,
}: ThreadComposerProps) {
  const {
    closeStampPanel,
    dragActive,
    handleDrag,
    handleDrop,
    hasPayload,
    openStampPanel,
    removePendingFile,
    stampPanelOpen,
  } = useComposerSurfaceState({
    activeRoomId,
    draft,
    pendingFiles,
    selectedStampIds,
    setPendingFiles,
  });

  function reorderStamps(stampIds: string[]) {
    setSelectedStampIds(stampIds);
  }

  return (
    <>
      <form
        className={`threadComposer${dragActive ? " isDragActive" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onSubmit={onSend}
      >
        {dragActive ? <div className="composerDropHint">ここにドロップして添付</div> : null}
        <RichMarkdownEditor
          value={draft}
          onChange={setDraft}
          placeholder="スレッドに返信"
          mentionUsers={mentionUsers}
          onRemoveStamp={onToggleStamp}
          onReorderStamps={reorderStamps}
          onUploadInlineFile={onUploadInlineFile}
          selectedStampIds={selectedStampIds}
          stamps={stamps}
          toolbarExtra={<ComposerStampToolbarButton onOpen={openStampPanel} />}
        />
        <PendingAttachments files={pendingFiles} onRemove={removePendingFile} />
        <button type="submit" title="スレッドに送信" disabled={!hasPayload || sending}>
          <Send size={17} />
        </button>
      </form>
      <ComposerStampPicker
        open={stampPanelOpen}
        stamps={stamps}
        stampFolders={stampFolders}
        selectedStampIds={selectedStampIds}
        stampUploading={stampUploading}
        onClose={closeStampPanel}
        onToggleStamp={onToggleStamp}
        onUploadStampImage={onUploadStampImage}
      />
    </>
  );
}
