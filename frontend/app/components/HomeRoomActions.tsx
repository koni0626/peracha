import type { FormEvent } from "react";
import { KeyRound, MessageSquarePlus } from "lucide-react";

type HomeRoomActionsProps = {
  newRoomName: string;
  acceptToken: string;
  setNewRoomName: (name: string) => void;
  setAcceptToken: (token: string) => void;
  onCreateRoom: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onAcceptInvitation: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function HomeRoomActions({
  newRoomName,
  acceptToken,
  setNewRoomName,
  setAcceptToken,
  onCreateRoom,
  onAcceptInvitation,
}: HomeRoomActionsProps) {
  return (
    <div className="homeActions">
      <form className="homeActionCard" onSubmit={onCreateRoom}>
        <div>
          <h2>ルームを作成</h2>
          <p>案件、会社、プロジェクトなど、会話の単位ごとに作れます。</p>
        </div>
        <input value={newRoomName} onChange={(event) => setNewRoomName(event.target.value)} placeholder="例: 提案資料の更新" />
        <button type="submit">
          <MessageSquarePlus size={17} />
          作成
        </button>
      </form>

      <form className="homeActionCard" onSubmit={onAcceptInvitation}>
        <div>
          <h2>招待で参加</h2>
          <p>相手から届いた招待URL、または招待トークンでルームに参加できます。</p>
        </div>
        <input value={acceptToken} onChange={(event) => setAcceptToken(event.target.value)} placeholder="招待トークン" />
        <button type="submit" disabled={!acceptToken.trim()}>
          <KeyRound size={17} />
          参加
        </button>
      </form>
    </div>
  );
}
