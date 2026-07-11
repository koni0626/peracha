import { useState } from "react";
import type { FormEvent } from "react";

import type { Room, RoomContextMenu } from "../types";
import { SidebarRoomButton } from "./SidebarRoomButton";
import { SidebarRoomCreateForm } from "./SidebarRoomCreateForm";
import { SidebarHomeRoomButton, SidebarRoomAddButton } from "./SidebarRoomListControls";

type SidebarRoomListProps = {
  activeRoomId: string | null;
  mentionedByRoom: Record<string, boolean>;
  newRoomName: string;
  onCreateRoom: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  rooms: Room[];
  roomSecondaryLabel: (room: Room) => string | null;
  setActiveRoomId: (roomId: string | null) => void;
  setNewRoomName: (value: string) => void;
  setRoomContextMenu: (menu: RoomContextMenu | null) => void;
  unreadByRoom: Record<string, number>;
};

export function SidebarRoomList({
  activeRoomId,
  mentionedByRoom,
  newRoomName,
  onCreateRoom,
  rooms,
  roomSecondaryLabel,
  setActiveRoomId,
  setNewRoomName,
  setRoomContextMenu,
  unreadByRoom,
}: SidebarRoomListProps) {
  const [creatingRoom, setCreatingRoom] = useState(false);

  function closeCreateForm() {
    setCreatingRoom(false);
    setNewRoomName("");
  }

  return (
    <div className="roomList">
      <SidebarHomeRoomButton activeRoomId={activeRoomId} setActiveRoomId={setActiveRoomId} />
      {rooms.map((room) => {
        const secondaryLabel = roomSecondaryLabel(room);
        return (
          <SidebarRoomButton
            activeRoomId={activeRoomId}
            mentioned={Boolean(mentionedByRoom[room.id])}
            key={room.id}
            room={room}
            secondaryLabel={secondaryLabel}
            setActiveRoomId={setActiveRoomId}
            setRoomContextMenu={setRoomContextMenu}
            unreadCount={unreadByRoom[room.id] ?? 0}
          />
        );
      })}
      {creatingRoom ? (
        <SidebarRoomCreateForm
          newRoomName={newRoomName}
          onCancel={closeCreateForm}
          onCreateRoom={onCreateRoom}
          setNewRoomName={setNewRoomName}
        />
      ) : (
        <SidebarRoomAddButton onStartCreate={() => setCreatingRoom(true)} />
      )}
    </div>
  );
}
