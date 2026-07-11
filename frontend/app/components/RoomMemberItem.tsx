import { UserMinus } from "lucide-react";

import type { RoomMember } from "../types";

type RoomMemberItemProps = {
  currentUserId: string;
  member: RoomMember;
  onRemoveRoomMember: (memberId: string) => void | Promise<void>;
  onUpdateRoomMember: (memberId: string, role: string) => void | Promise<void>;
};

export function RoomMemberItem({
  currentUserId,
  member,
  onRemoveRoomMember,
  onUpdateRoomMember,
}: RoomMemberItemProps) {
  return (
    <div>
      <span>{member.user.name.slice(0, 1).toUpperCase()}</span>
      <div>
        <strong>{member.user.name}</strong>
        <small>{member.user.email}</small>
      </div>
      <select
        value={member.role}
        onChange={(event) => onUpdateRoomMember(member.id, event.target.value)}
        aria-label={`${member.user.name}の権限`}
      >
        <option value="owner">owner</option>
        <option value="admin">admin</option>
        <option value="member">member</option>
        <option value="guest">guest</option>
      </select>
      <button
        type="button"
        onClick={() => onRemoveRoomMember(member.id)}
        disabled={member.user.id === currentUserId}
        title="メンバーを削除"
      >
        <UserMinus size={15} />
      </button>
    </div>
  );
}
