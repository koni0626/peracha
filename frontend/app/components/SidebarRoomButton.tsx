import { Hash } from "lucide-react";

import type { Room, RoomContextMenu } from "../types";

type SidebarRoomButtonProps = {
  activeRoomId: string | null;
  mentioned: boolean;
  room: Room;
  secondaryLabel: string | null;
  setActiveRoomId: (roomId: string | null) => void;
  setRoomContextMenu: (menu: RoomContextMenu | null) => void;
  unreadCount: number;
};

export function SidebarRoomButton({
  activeRoomId,
  mentioned,
  room,
  secondaryLabel,
  setActiveRoomId,
  setRoomContextMenu,
  unreadCount,
}: SidebarRoomButtonProps) {
  return (
    <button
      className={room.id === activeRoomId ? "roomButton active" : "roomButton"}
      onClick={() => setActiveRoomId(room.id)}
      onContextMenu={(event) => {
        event.preventDefault();
        setRoomContextMenu({ roomId: room.id, x: event.clientX, y: event.clientY });
      }}
    >
      <Hash size={15} />
      <span className="roomButtonText">
        <strong className="roomNameLine">
          <span className="roomNameText">{room.name}</span>
          {unreadCount ? (
            <span className="unreadBadge roomUnreadBadge" title={`未読 ${unreadCount}件`}>
              {unreadCount}
            </span>
          ) : null}
        </strong>
        {secondaryLabel ? <small>{secondaryLabel}</small> : null}
      </span>
      {mentioned ? <span className="mentionBadge">@</span> : null}
    </button>
  );
}
