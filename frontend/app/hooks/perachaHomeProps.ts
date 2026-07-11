import type { AuthenticatedPropsOptions, AuthenticatedShellProps } from "./perachaAppTypes";

export function createHomeProps({
  access,
  facilitator,
  management,
  notices,
  session,
  setError,
  stamps,
  user,
}: AuthenticatedPropsOptions): AuthenticatedShellProps["home"] {
  return {
    notices,
    profile: { currentUser: user, onUploadAvatar: session.uploadAvatar },
    roomActions: {
      acceptToken: access.acceptToken,
      newRoomName: management.newRoomName,
      onAcceptInvitation: access.acceptInvitation,
      onCreateRoom: management.createRoom,
      setAcceptToken: access.setAcceptToken,
      setNewRoomName: management.setNewRoomName,
    },
    roomOps: {
      homeRoomId: session.homeRoomId,
      onLoadTasks: facilitator.loadTasks,
      onSaveTaskProgress: facilitator.saveTaskProgress,
      onUpdateTask: facilitator.updateTask,
      rooms: session.rooms,
      setError,
      setHomeRoomId: session.setHomeRoomId,
      setTaskNotes: facilitator.setTaskNotes,
      taskNotes: facilitator.taskNotes,
      tasks: facilitator.tasks,
    },
    stampManagement: {
      onCreateStampFolder: stamps.createFolderByName,
      onDeleteStamp: stamps.deleteStamp,
      onDeleteStampFolder: stamps.deleteStampFolder,
      onUploadStampImage: stamps.uploadStampImage,
      selectedUploadFolderId: stamps.selectedUploadFolderId,
      setSelectedUploadFolderId: stamps.setSelectedUploadFolderId,
      stampFolders: stamps.stampFolders,
      stamps: stamps.stamps,
      stampUploading: stamps.stampUploading,
    },
  };
}
