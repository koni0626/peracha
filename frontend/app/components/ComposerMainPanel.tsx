import { ComposerCompactButton, ComposerModeBar, ComposerReplyBar } from "./ComposerControls";
import { ComposerStampToolbarButton } from "./ComposerStampToolbarButton";
import { ComposerTopActions } from "./ComposerTopActions";
import type { ComposerProps } from "./composerTypes";
import { PendingAttachments } from "./PendingAttachments";
import { RichMarkdownEditor } from "./RichMarkdownEditor";

type ComposerMainPanelProps = Pick<
  ComposerProps,
  | "activeRoomId"
  | "composerAction"
  | "composerMode"
  | "draft"
  | "mentionUsers"
  | "onCancelReply"
  | "onClarifyDraft"
  | "onImproveDraft"
  | "onReorderStamps"
  | "onSendPeraichi"
  | "onToggleStamp"
  | "onUploadInlineFile"
  | "pendingFiles"
  | "replyTo"
  | "selectedStampIds"
  | "setComposerMode"
  | "setDraft"
  | "stamps"
> & {
  blockingBusy: boolean;
  dragActive: boolean;
  hasPayload: boolean;
  onOpenStampPanel: () => void;
  onRemovePendingFile: (index: number) => void;
  proofreading: boolean;
};

export function ComposerMainPanel({
  activeRoomId,
  blockingBusy,
  composerAction,
  composerMode,
  draft,
  dragActive,
  hasPayload,
  mentionUsers,
  onCancelReply,
  onClarifyDraft,
  onImproveDraft,
  onOpenStampPanel,
  onRemovePendingFile,
  onReorderStamps,
  onSendPeraichi,
  onToggleStamp,
  onUploadInlineFile,
  pendingFiles,
  proofreading,
  replyTo,
  selectedStampIds,
  setComposerMode,
  setDraft,
  stamps,
}: ComposerMainPanelProps) {
  return (
    <div className="composerMain">
      {dragActive ? <div className="composerDropHint">ここにドロップして添付</div> : null}
      <div className="composerModeBar">
        <ComposerModeBar composerMode={composerMode} setComposerMode={setComposerMode} />
        <ComposerCompactButton composerMode={composerMode} setComposerMode={setComposerMode} />
        <ComposerTopActions
          activeRoomId={activeRoomId}
          blockingBusy={blockingBusy}
          composerAction={composerAction}
          draft={draft}
          hasMessagePayload={hasPayload}
          proofreading={proofreading}
          onClarifyDraft={onClarifyDraft}
          onImproveDraft={onImproveDraft}
          onSendPeraichi={onSendPeraichi}
        />
      </div>
      <ComposerReplyBar replyTo={replyTo} onCancelReply={onCancelReply} />
      <RichMarkdownEditor
        value={draft}
        onChange={setDraft}
        placeholder="メッセージを入力"
        stamps={stamps}
        mentionUsers={mentionUsers}
        selectedStampIds={selectedStampIds}
        onRemoveStamp={onToggleStamp}
        onReorderStamps={onReorderStamps}
        onUploadInlineFile={onUploadInlineFile}
        toolbarExtra={<ComposerStampToolbarButton onOpen={onOpenStampPanel} />}
      />
      <PendingAttachments files={pendingFiles} onRemove={onRemovePendingFile} />
    </div>
  );
}
