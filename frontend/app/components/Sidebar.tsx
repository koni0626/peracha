import { SidebarAccountActions } from "./SidebarAccountActions";
import { SidebarBrand } from "./SidebarBrand";
import { SidebarRoomContextMenu } from "./SidebarRoomContextMenu";
import { SidebarRoomList } from "./SidebarRoomList";
import type { SidebarProps } from "./sidebarTypes";

export function Sidebar({
  rooms,
  currentUser,
  activeRoomId,
  roomContextMenu,
  contextMenuRoom,
  notificationPermission,
  mentionedByRoom,
  unreadByRoom,
  roomSecondaryLabel,
  newRoomName,
  setActiveRoomId,
  setNewRoomName,
  setRoomContextMenu,
  onCreateRoom,
  onLogout,
  onRequestNotifications,
  onOpenRoomEditor,
  onOpenRoomFolder,
  onDeleteRoom,
}: SidebarProps) {
  return (
    <>
      <aside className="sidebar">
        <SidebarBrand currentUser={currentUser} />
        <SidebarAccountActions
          notificationPermission={notificationPermission}
          onLogout={onLogout}
          onRequestNotifications={onRequestNotifications}
        />

        <div className="sideSection">
          <div className="sideHeader">
            <span>ルーム</span>
          </div>
          <SidebarRoomList
            activeRoomId={activeRoomId}
            mentionedByRoom={mentionedByRoom}
            rooms={rooms}
            roomSecondaryLabel={roomSecondaryLabel}
            newRoomName={newRoomName}
            onCreateRoom={onCreateRoom}
            setActiveRoomId={setActiveRoomId}
            setNewRoomName={setNewRoomName}
            setRoomContextMenu={setRoomContextMenu}
            unreadByRoom={unreadByRoom}
          />
        </div>

      </aside>

      {roomContextMenu && contextMenuRoom ? (
        <SidebarRoomContextMenu
          contextMenuRoom={contextMenuRoom}
          roomContextMenu={roomContextMenu}
          onDeleteRoom={onDeleteRoom}
          onOpenRoomEditor={onOpenRoomEditor}
          onOpenRoomFolder={onOpenRoomFolder}
        />
      ) : null}
    </>
  );
}
