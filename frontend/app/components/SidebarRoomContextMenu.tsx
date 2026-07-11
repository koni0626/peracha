import { FolderOpen, Settings, Trash2 } from "lucide-react";

import type { Room, RoomContextMenu } from "../types";

type SidebarRoomContextMenuProps = {
  contextMenuRoom: Room;
  roomContextMenu: RoomContextMenu;
  onDeleteRoom: (room: Room) => void | Promise<void>;
  onOpenRoomEditor: (roomId: string) => void | Promise<void>;
  onOpenRoomFolder: (roomId: string) => void | Promise<void>;
};

export function SidebarRoomContextMenu({
  contextMenuRoom,
  roomContextMenu,
  onDeleteRoom,
  onOpenRoomEditor,
  onOpenRoomFolder,
}: SidebarRoomContextMenuProps) {
  return (
    <div
      className="roomContextMenu"
      style={{ left: roomContextMenu.x, top: roomContextMenu.y }}
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" onClick={() => onOpenRoomEditor(contextMenuRoom.id)}>
        <Settings size={15} />
        ルームの編集
      </button>
      <button type="button" onClick={() => onOpenRoomFolder(contextMenuRoom.id)}>
        <FolderOpen size={15} />
        フォルダを開く
      </button>
      <button type="button" className="dangerMenuItem" onClick={() => onDeleteRoom(contextMenuRoom)}>
        <Trash2 size={15} />
        ルームの削除
      </button>
    </div>
  );
}
