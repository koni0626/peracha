import type { FormEvent } from "react";
import { Check } from "lucide-react";

type RoomSettingsFormProps = {
  roomName: string;
  roomEditName: string;
  setRoomEditName: (value: string) => void;
  onUpdateRoomDetails: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function RoomSettingsForm({
  roomName,
  roomEditName,
  setRoomEditName,
  onUpdateRoomDetails,
}: RoomSettingsFormProps) {
  return (
    <form className="roomSettingsForm" onSubmit={onUpdateRoomDetails}>
      <label>
        ルーム名
        <input value={roomEditName} onChange={(event) => setRoomEditName(event.target.value)} />
      </label>
      <button type="submit" disabled={!roomEditName.trim() || roomEditName.trim() === roomName}>
        <Check size={16} />
        保存
      </button>
    </form>
  );
}
