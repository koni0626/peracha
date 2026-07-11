import { RefreshCw } from "lucide-react";

import type { RoomMember } from "../types";
import { RoomMemberItem } from "./RoomMemberItem";

type RoomMemberListProps = {
  activeRoomId: string | null;
  currentUserId: string;
  members: RoomMember[];
  onLoadRoomMembers: () => void | Promise<void>;
  onRemoveRoomMember: (memberId: string) => void | Promise<void>;
  onUpdateRoomMember: (memberId: string, role: string) => void | Promise<void>;
};

export function RoomMemberList({
  activeRoomId,
  currentUserId,
  members,
  onLoadRoomMembers,
  onRemoveRoomMember,
  onUpdateRoomMember,
}: RoomMemberListProps) {
  return (
    <section>
      <div className="sectionTitleRow">
        <h3>参加ユーザー</h3>
        <button type="button" onClick={onLoadRoomMembers} disabled={!activeRoomId} title="更新">
          <RefreshCw size={16} />
        </button>
      </div>
      {members.length > 0 ? (
        <div className="memberList">
          {members.map((member) => (
            <RoomMemberItem
              currentUserId={currentUserId}
              key={member.id}
              member={member}
              onRemoveRoomMember={onRemoveRoomMember}
              onUpdateRoomMember={onUpdateRoomMember}
            />
          ))}
        </div>
      ) : (
        <p className="mutedText">参加ユーザーを読み込んでいます。</p>
      )}
    </section>
  );
}
