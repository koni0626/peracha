import { RefreshCw } from "lucide-react";

type RoomInvitationHeaderProps = {
  activeRoomId: string | null;
  onLoadInvitations: () => void | Promise<void>;
};

export function RoomInvitationHeader({ activeRoomId, onLoadInvitations }: RoomInvitationHeaderProps) {
  return (
    <div className="sectionTitleRow">
      <h3>ユーザーを追加</h3>
      <button type="button" onClick={onLoadInvitations} disabled={!activeRoomId} title="招待一覧を更新">
        <RefreshCw size={16} />
      </button>
    </div>
  );
}
