import { RoomEditModalHeader } from "./RoomEditModalHeader";
import { RoomInvitationPanel } from "./RoomInvitationPanel";
import { RoomMemberList } from "./RoomMemberList";
import { RoomSettingsForm } from "./RoomSettingsForm";
import type { RoomEditModalProps } from "./roomEditModalTypes";

export function RoomEditModal({
  room,
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
  onClose,
  onUpdateRoomDetails,
  onLoadRoomMembers,
  onLoadInvitations,
  onSearchRegisteredUsers,
  onAddRegisteredUser,
  onCreateInvitation,
  onRevokeInvitation,
  onUpdateRoomMember,
  onRemoveRoomMember,
}: RoomEditModalProps) {
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="roomEditTitle">
      <section className="roomEditModal">
        <RoomEditModalHeader roomName={room.name} onClose={onClose} />
        <RoomSettingsForm
          roomName={room.name}
          roomEditName={roomEditName}
          setRoomEditName={setRoomEditName}
          onUpdateRoomDetails={onUpdateRoomDetails}
        />

        <div className="roomEditGrid">
          <RoomMemberList
            activeRoomId={activeRoomId}
            currentUserId={currentUserId}
            members={roomMembers}
            onLoadRoomMembers={onLoadRoomMembers}
            onRemoveRoomMember={onRemoveRoomMember}
            onUpdateRoomMember={onUpdateRoomMember}
          />
          <RoomInvitationPanel
            activeRoomId={activeRoomId}
            invitations={invitations}
            inviteEmail={inviteEmail}
            inviteResult={inviteResult}
            inviteRole={inviteRole}
            userSearchLoading={userSearchLoading}
            userSearchQuery={userSearchQuery}
            userSearchResults={userSearchResults}
            onAddRegisteredUser={onAddRegisteredUser}
            onCreateInvitation={onCreateInvitation}
            onLoadInvitations={onLoadInvitations}
            onRevokeInvitation={onRevokeInvitation}
            onSearchRegisteredUsers={onSearchRegisteredUsers}
            setInviteEmail={setInviteEmail}
            setInviteRole={setInviteRole}
            setUserSearchQuery={setUserSearchQuery}
          />
        </div>
      </section>
    </div>
  );
}
