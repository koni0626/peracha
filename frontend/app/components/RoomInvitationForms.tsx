import type { FormEvent } from "react";
import { Search, UserPlus } from "lucide-react";

type RegisteredUserSearchFormProps = {
  activeRoomId: string | null;
  userSearchLoading: boolean;
  userSearchQuery: string;
  onSearchRegisteredUsers: (event?: FormEvent<HTMLFormElement>) => void | Promise<void>;
  setUserSearchQuery: (value: string) => void;
};

export function RegisteredUserSearchForm({
  activeRoomId,
  userSearchLoading,
  userSearchQuery,
  onSearchRegisteredUsers,
  setUserSearchQuery,
}: RegisteredUserSearchFormProps) {
  return (
    <form className="userSearchForm" onSubmit={onSearchRegisteredUsers}>
      <div className="searchInputRow">
        <input
          value={userSearchQuery}
          onChange={(event) => setUserSearchQuery(event.target.value)}
          placeholder="名前またはメールで検索"
        />
        <button type="submit" disabled={!activeRoomId || userSearchLoading} title="登録済みユーザーを検索">
          <Search size={16} />
        </button>
      </div>
    </form>
  );
}

type EmailInvitationFormProps = {
  activeRoomId: string | null;
  inviteEmail: string;
  inviteRole: string;
  onCreateInvitation: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  setInviteEmail: (value: string) => void;
  setInviteRole: (value: string) => void;
};

export function EmailInvitationForm({
  activeRoomId,
  inviteEmail,
  inviteRole,
  onCreateInvitation,
  setInviteEmail,
  setInviteRole,
}: EmailInvitationFormProps) {
  return (
    <form className="inviteForm" onSubmit={onCreateInvitation}>
      <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="partner@example.com" />
      <select value={inviteRole} onChange={(event) => setInviteRole(event.target.value)} aria-label="招待権限">
        <option value="member">member</option>
        <option value="admin">admin</option>
        <option value="guest">guest</option>
      </select>
      <button type="submit" disabled={!activeRoomId}>
        <UserPlus size={16} />
        招待
      </button>
    </form>
  );
}
