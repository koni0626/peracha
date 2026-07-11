import type { AuthenticatedPropsOptions, AuthenticatedShellProps } from "./perachaAppTypes";

export function createSidebarProps({
  files,
  logout,
  management,
  realtime,
  session,
  user,
}: AuthenticatedPropsOptions): AuthenticatedShellProps["sidebar"] {
  return {
    rooms: session.rooms,
    currentUser: user,
    activeRoomId: session.activeRoomId,
    roomContextMenu: management.roomContextMenu,
    contextMenuRoom: management.contextMenuRoom,
    notificationPermission: realtime.notificationPermission,
    mentionedByRoom: realtime.mentionedByRoom,
    unreadByRoom: realtime.unreadByRoom,
    roomSecondaryLabel: management.roomSecondaryLabel,
    newRoomName: management.newRoomName,
    setActiveRoomId: session.setActiveRoomId,
    setNewRoomName: management.setNewRoomName,
    setRoomContextMenu: management.setRoomContextMenu,
    onCreateRoom: management.createRoom,
    onLogout: logout,
    onRequestNotifications: realtime.requestNotifications,
    onOpenRoomEditor: management.openRoomEditor,
    onOpenRoomFolder: files.openRoomFolder,
    onDeleteRoom: management.deleteRoom,
  };
}
