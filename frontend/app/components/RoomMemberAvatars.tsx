import { Plus } from "lucide-react";

import { apiUrl } from "../api";
import type { RoomMember } from "../types";

type RoomMemberAvatarsProps = {
  members: RoomMember[];
  onAddMember?: () => void | Promise<void>;
};

export function RoomMemberAvatars({ members, onAddMember }: RoomMemberAvatarsProps) {
  const visibleMembers = members.slice(0, 8);
  const hiddenMemberCount = Math.max(0, members.length - visibleMembers.length);

  return (
    <div className="roomMemberAvatars" aria-label="参加者">
      {visibleMembers.map((member) => (
        <span className="roomMemberAvatar" data-tooltip={member.user.name} key={member.id} tabIndex={0} title={member.user.name}>
          {member.user.avatar_url ? (
            <img src={apiUrl(member.user.avatar_url)} alt={member.user.name} />
          ) : (
            member.user.name.slice(0, 1).toUpperCase()
          )}
        </span>
      ))}
      {hiddenMemberCount > 0 ? (
        <span className="roomMemberAvatar more" data-tooltip={`${hiddenMemberCount}人の参加者`} tabIndex={0} title={`${hiddenMemberCount}人の参加者`}>
          +{hiddenMemberCount}
        </span>
      ) : null}
      {onAddMember ? (
        <button
          type="button"
          className="roomMemberAddButton"
          data-tooltip="ユーザーを追加"
          title="ユーザーを追加"
          onClick={onAddMember}
        >
          <Plus size={17} />
        </button>
      ) : null}
    </div>
  );
}
