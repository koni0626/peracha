import type { FormEvent } from "react";

import type { Invitation, Room, RoomMember, User } from "../types";

export type RoomEditModalProps = {
  room: Room;
  activeRoomId: string | null;
  currentUserId: string;
  roomEditName: string;
  roomMembers: RoomMember[];
  userSearchQuery: string;
  userSearchResults: User[];
  userSearchLoading: boolean;
  inviteEmail: string;
  inviteRole: string;
  inviteResult: Invitation | null;
  invitations: Invitation[];
  setRoomEditName: (value: string) => void;
  setUserSearchQuery: (value: string) => void;
  setInviteEmail: (value: string) => void;
  setInviteRole: (value: string) => void;
  onClose: () => void;
  onUpdateRoomDetails: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onLoadRoomMembers: () => void | Promise<void>;
  onLoadInvitations: () => void | Promise<void>;
  onSearchRegisteredUsers: (event?: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onAddRegisteredUser: (candidate: User) => void | Promise<void>;
  onCreateInvitation: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onRevokeInvitation: (invitationId: string) => void | Promise<void>;
  onUpdateRoomMember: (memberId: string, role: string) => void | Promise<void>;
  onRemoveRoomMember: (memberId: string) => void | Promise<void>;
};
