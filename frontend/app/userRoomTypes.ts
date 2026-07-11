export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
};

export type Room = {
  id: string;
  workspace_id: string;
  workspace_name: string | null;
  name: string;
  description: string | null;
  unread_count: number;
  created_at: string;
};

export type RoomMember = {
  id: string;
  room_id: string;
  user: User;
  role: string;
  joined_at: string;
};

export type Invitation = {
  id: string;
  room_id: string;
  invited_email: string;
  role: string;
  status: string;
  token: string | null;
  accept_url: string | null;
  email_sent: boolean;
  email_error: string | null;
  expires_at: string;
  created_at: string;
};

export type InvitationAcceptResponse = {
  room: Room;
  status: string;
};

export type RoomContextMenu = {
  roomId: string;
  x: number;
  y: number;
};
