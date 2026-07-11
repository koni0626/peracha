import type { Invitation } from "../types";

type InvitationTokenBoxProps = {
  invitation: Invitation | null;
};

export function InvitationTokenBox({ invitation }: InvitationTokenBoxProps) {
  if (!invitation?.token) {
    return null;
  }

  return (
    <div className="tokenBox">
      <strong>招待トークン</strong>
      <code>{invitation.token}</code>
      {invitation.accept_url ? (
        <a href={invitation.accept_url} target="_blank" rel="noreferrer">
          招待URLを開く
        </a>
      ) : null}
      {invitation.email_sent ? <small>招待メール送信済み</small> : null}
      {invitation.email_error ? <small>メール送信失敗: {invitation.email_error}</small> : null}
    </div>
  );
}
