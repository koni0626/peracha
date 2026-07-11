import type { FormEvent } from "react";

import type { Room, RoomContextMenu, User } from "../types";

export type SidebarProps = {
  rooms: Room[];
  currentUser: User;
  activeRoomId: string | null;
  roomContextMenu: RoomContextMenu | null;
  contextMenuRoom: Room | null | undefined;
  notificationPermission: NotificationPermission;
  mentionedByRoom: Record<string, boolean>;
  unreadByRoom: Record<string, number>;
  roomSecondaryLabel: (room: Room) => string | null;
  newRoomName: string;
  setActiveRoomId: (roomId: string | null) => void;
  setNewRoomName: (value: string) => void;
  setRoomContextMenu: (menu: RoomContextMenu | null) => void;
  onCreateRoom: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onLogout: () => void | Promise<void>;
  onRequestNotifications: () => void | Promise<void>;
  onOpenRoomEditor: (roomId: string) => void | Promise<void>;
  onOpenRoomFolder: (roomId: string) => void | Promise<void>;
  onDeleteRoom: (room: Room) => void | Promise<void>;
};
