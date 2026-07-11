import { X } from "lucide-react";

type RoomEditModalHeaderProps = {
  roomName: string;
  onClose: () => void;
};

export function RoomEditModalHeader({ roomName, onClose }: RoomEditModalHeaderProps) {
  return (
    <header>
      <div>
        <p className="eyebrow">Room Settings</p>
        <h2 id="roomEditTitle">{roomName} の編集</h2>
      </div>
      <button type="button" className="iconButton" onClick={onClose} title="閉じる">
        <X size={18} />
      </button>
    </header>
  );
}
