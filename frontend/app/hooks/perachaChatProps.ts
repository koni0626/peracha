import type { AuthenticatedPropsOptions, AuthenticatedShellProps } from "./perachaAppTypes";

export function createChatProps({
  access,
  composer,
  composerState,
  facilitator,
  files,
  management,
  notices,
  realtime,
  session,
  stamps,
  timeline,
}: AuthenticatedPropsOptions): AuthenticatedShellProps["chat"] {
  if (!management.activeRoom) {
    return null;
  }

  return {
    composer: {
      action: composer.composerAction,
      draft: composerState.draft,
      mode: composerState.mode,
      mentionUsers: access.roomMembers.map((member) => member.user),
      onClarifyDraft: composer.clarifyDraft,
      onCancelReply: () => composerState.setReplyTo(null),
      onImproveDraft: composer.improveDraft,
      onReplyToMessage: composerState.setReplyTo,
      onReorderStamps: stamps.reorderSelectedStamps,
      onSendMessage: composer.sendMessage,
      onSendPeraichi: composer.sendPeraichiMessage,
      onToggleStamp: stamps.toggleStamp,
      onUploadInlineFile: composer.uploadInlineFile,
      onUploadStampImage: stamps.uploadStampImage,
      pendingFiles: composer.pendingFiles,
      replyTo: composerState.replyTo,
      selectedStampIds: stamps.selectedStampIds,
      setDraft: composerState.setDraft,
      setMode: composerState.setMode,
      setPendingFiles: composer.setPendingFiles,
      stampFolders: stamps.stampFolders,
      stampUploading: stamps.stampUploading,
      stamps: stamps.stamps,
    },
    contextSearch: {
      loading: facilitator.contextLoading,
      query: facilitator.contextQuery,
      results: facilitator.contextResults,
      search: facilitator.searchContexts,
      setQuery: facilitator.setContextQuery,
    },
    notices,
    room: {
      activeRoom: management.activeRoom,
      activeRoomId: session.activeRoomId,
      loadRoomFiles: files.loadRoomFiles,
      members: access.roomMembers,
      onOpenFolder: files.openRoomFolder,
      onOpenRoomEditor: management.openRoomEditor,
      uploadRoomFile: files.uploadRoomFile,
    },
    timeline: {
      messages: realtime.messages,
      onContentLoad: timeline.handleTimelineContentLoad,
      onScroll: timeline.handleTimelineScroll,
      ref: timeline.timelineRef,
    },
  };
}
