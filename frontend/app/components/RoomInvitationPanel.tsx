import type { FormEvent } from "react";

import type { Invitation, User } from "../types";
import { InvitationTokenBox } from "./InvitationTokenBox";
import { RoomInvitationHeader } from "./RoomInvitationHeader";
import { EmailInvitationForm, RegisteredUserSearchForm } from "./RoomInvitationForms";
import { InvitationList, UserSearchResults } from "./RoomInvitationLists";

type RoomInvitationPanelProps = {
  activeRoomId: string | null;
  invitations: Invitation[];
  inviteEmail: string;
  inviteResult: Invitation | null;
  inviteRole: string;
  userSearchLoading: boolean;
  userSearchQuery: string;
  userSearchResults: User[];
  onAddRegisteredUser: (candidate: User) => void | Promise<void>;
  onCreateInvitation: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onLoadInvitations: () => void | Promise<void>;
  onRevokeInvitation: (invitationId: string) => void | Promise<void>;
  onSearchRegisteredUsers: (event?: FormEvent<HTMLFormElement>) => void | Promise<void>;
  setInviteEmail: (value: string) => void;
  setInviteRole: (value: string) => void;
  setUserSearchQuery: (value: string) => void;
};

export function RoomInvitationPanel({
  activeRoomId,
  invitations,
  inviteEmail,
  inviteResult,
  inviteRole,
  userSearchLoading,
  userSearchQuery,
  userSearchResults,
  onAddRegisteredUser,
  onCreateInvitation,
  onLoadInvitations,
  onRevokeInvitation,
  onSearchRegisteredUsers,
  setInviteEmail,
  setInviteRole,
  setUserSearchQuery,
}: RoomInvitationPanelProps) {
  return (
    <section>
      <RoomInvitationHeader activeRoomId={activeRoomId} onLoadInvitations={onLoadInvitations} />
      <RegisteredUserSearchForm
        activeRoomId={activeRoomId}
        userSearchLoading={userSearchLoading}
        userSearchQuery={userSearchQuery}
        onSearchRegisteredUsers={onSearchRegisteredUsers}
        setUserSearchQuery={setUserSearchQuery}
      />
      <UserSearchResults candidates={userSearchResults} onAddRegisteredUser={onAddRegisteredUser} />
      <EmailInvitationForm
        activeRoomId={activeRoomId}
        inviteEmail={inviteEmail}
        inviteRole={inviteRole}
        onCreateInvitation={onCreateInvitation}
        setInviteEmail={setInviteEmail}
        setInviteRole={setInviteRole}
      />
      <InvitationTokenBox invitation={inviteResult} />
      <InvitationList invitations={invitations} onRevokeInvitation={onRevokeInvitation} />
    </section>
  );
}
