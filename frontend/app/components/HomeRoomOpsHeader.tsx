import type { Room } from "../types";

type HomeRoomOpsHeaderProps = {
  rooms: Room[];
  selectedHomeRoomId: string | null;
  setHomeRoomId: (roomId: string | null) => void;
};

export function HomeRoomOpsHeader({ rooms, selectedHomeRoomId, setHomeRoomId }: HomeRoomOpsHeaderProps) {
  return (
    <div className="homeManagementHeader">
      <div>
        <p className="eyebrow">Room Ops</p>
        <h2>ルーム運用</h2>
        <p>タスクとAPI連携は、対象ルームを選んでここで管理します。</p>
      </div>
      <select
        value={selectedHomeRoomId ?? ""}
        onChange={(event) => setHomeRoomId(event.target.value || null)}
        disabled={rooms.length === 0}
        aria-label="運用対象ルーム"
      >
        {rooms.length === 0 ? <option value="">ルームがありません</option> : null}
        {rooms.map((room) => (
          <option value={room.id} key={room.id}>
            {room.name}
          </option>
        ))}
      </select>
    </div>
  );
}
