import type { RoomEditModalProps } from "./roomEditModalTypes";
import type { RoomModalsProps } from "./roomModalsTypes";

export type RoomEditModalSectionProps = Pick<
  RoomModalsProps,
  | "activeRoom"
  | "activeRoomId"
  | "currentUserId"
  | "invitations"
  | "inviteEmail"
  | "inviteResult"
  | "inviteRole"
  | "roomEditName"
  | "roomEditOpen"
  | "roomMembers"
  | "userSearchLoading"
  | "userSearchQuery"
  | "userSearchResults"
  | "onAddRegisteredUser"
  | "onCloseRoomEdit"
  | "onCreateInvitation"
  | "onLoadInvitations"
  | "onLoadRoomMembers"
  | "onRemoveRoomMember"
  | "onRevokeInvitation"
  | "onSearchRegisteredUsers"
  | "onUpdateRoomDetails"
  | "onUpdateRoomMember"
  | "setInviteEmail"
  | "setInviteRole"
  | "setRoomEditName"
  | "setUserSearchQuery"
>;

export function selectRoomEditModalProps({
  activeRoom,
  activeRoomId,
  currentUserId,
  invitations,
  inviteEmail,
  inviteResult,
  inviteRole,
  roomEditName,
  roomEditOpen,
  roomMembers,
  userSearchLoading,
  userSearchQuery,
  userSearchResults,
  onAddRegisteredUser,
  onCloseRoomEdit,
  onCreateInvitation,
  onLoadInvitations,
  onLoadRoomMembers,
  onRemoveRoomMember,
  onRevokeInvitation,
  onSearchRegisteredUsers,
  onUpdateRoomDetails,
  onUpdateRoomMember,
  setInviteEmail,
  setInviteRole,
  setRoomEditName,
  setUserSearchQuery,
}: RoomEditModalSectionProps): RoomEditModalProps | null {
  if (!roomEditOpen || !activeRoom) {
    return null;
  }

  return {
    room: activeRoom,
    activeRoomId,
    currentUserId,
    roomEditName,
    roomMembers,
    userSearchQuery,
    userSearchResults,
    userSearchLoading,
    inviteEmail,
    inviteRole,
    inviteResult,
    invitations,
    setRoomEditName,
    setUserSearchQuery,
    setInviteEmail,
    setInviteRole,
    onClose: onCloseRoomEdit,
    onUpdateRoomDetails,
    onLoadRoomMembers,
    onLoadInvitations,
    onSearchRegisteredUsers,
    onAddRegisteredUser,
    onCreateInvitation,
    onRevokeInvitation,
    onUpdateRoomMember,
    onRemoveRoomMember,
  };
}
