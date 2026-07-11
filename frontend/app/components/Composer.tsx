import { useComposerSurfaceState } from "../hooks/useComposerSurfaceState";
import { ComposerMainPanel } from "./ComposerMainPanel";
import { ComposerStampPicker } from "./ComposerStampPicker";
import type { ComposerProps } from "./composerTypes";

export function Composer({
  activeRoomId,
  composerMode,
  draft,
  setDraft,
  pendingFiles,
  setPendingFiles,
  setComposerMode,
  composerAction,
  stampFolders,
  stampUploading,
  stamps,
  mentionUsers,
  selectedStampIds,
  onSubmit,
  onCancelReply,
  onClarifyDraft,
  onImproveDraft,
  onReorderStamps,
  onSendPeraichi,
  onToggleStamp,
  onUploadInlineFile,
  onUploadStampImage,
  replyTo,
}: ComposerProps) {
  const proofreading = composerAction === "ai";
  const clarifying = composerAction === "clarify";
  const blockingBusy = composerAction === "send" || composerAction === "peraichi" || clarifying;
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

  return (
    <form
      className={`composer ${composerMode === "floating" ? "isFloating" : "isDocked"}${dragActive ? " isDragActive" : ""}`}
      onSubmit={onSubmit}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <ComposerMainPanel
        activeRoomId={activeRoomId}
        blockingBusy={blockingBusy}
        composerAction={composerAction}
        composerMode={composerMode}
        draft={draft}
        dragActive={dragActive}
        hasPayload={hasPayload}
        mentionUsers={mentionUsers}
        onCancelReply={onCancelReply}
        onClarifyDraft={onClarifyDraft}
        onImproveDraft={onImproveDraft}
        onOpenStampPanel={openStampPanel}
        onRemovePendingFile={removePendingFile}
        onReorderStamps={onReorderStamps}
        onSendPeraichi={onSendPeraichi}
        onToggleStamp={onToggleStamp}
        onUploadInlineFile={onUploadInlineFile}
        pendingFiles={pendingFiles}
        proofreading={proofreading}
        replyTo={replyTo}
        selectedStampIds={selectedStampIds}
        setComposerMode={setComposerMode}
        setDraft={setDraft}
        stamps={stamps}
      />
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
    </form>
  );
}
