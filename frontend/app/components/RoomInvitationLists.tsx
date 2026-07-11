import { Ban, UserPlus } from "lucide-react";

import type { Invitation, User } from "../types";

type UserSearchResultsProps = {
  candidates: User[];
  onAddRegisteredUser: (candidate: User) => void | Promise<void>;
};

export function UserSearchResults({ candidates, onAddRegisteredUser }: UserSearchResultsProps) {
  if (candidates.length === 0) {
    return <p className="mutedText">登録済みユーザーを検索して選択できます。未登録ユーザーはメールで招待できます。</p>;
  }

  return (
    <div className="userSearchResults">
      {candidates.map((candidate) => (
        <div key={candidate.id}>
          <span>{candidate.name.slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{candidate.name}</strong>
            <small>{candidate.email}</small>
          </div>
          <button type="button" onClick={() => onAddRegisteredUser(candidate)}>
            <UserPlus size={15} />
            追加
          </button>
        </div>
      ))}
    </div>
  );
}

type InvitationListProps = {
  invitations: Invitation[];
  onRevokeInvitation: (invitationId: string) => void | Promise<void>;
};

export function InvitationList({ invitations, onRevokeInvitation }: InvitationListProps) {
  if (invitations.length === 0) {
    return <p className="mutedText">保留中の招待はありません。</p>;
  }

  return (
    <div className="inviteList">
      {invitations.slice(0, 8).map((invitation) => (
        <div className={invitation.status === "revoked" ? "revoked" : ""} key={invitation.id}>
          <span>{invitation.status}</span>
          <strong>{invitation.invited_email}</strong>
          <small>
            {invitation.role} / {new Date(invitation.expires_at).toLocaleDateString("ja-JP")}
          </small>
          <button
            type="button"
            onClick={() => onRevokeInvitation(invitation.id)}
            disabled={invitation.status !== "pending"}
            title="招待を取り消す"
          >
            <Ban size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
