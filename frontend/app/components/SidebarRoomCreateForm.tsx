import type { FormEvent } from "react";
import { X } from "lucide-react";

type SidebarRoomCreateFormProps = {
  newRoomName: string;
  onCancel: () => void;
  onCreateRoom: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  setNewRoomName: (value: string) => void;
};

export function SidebarRoomCreateForm({
  newRoomName,
  onCancel,
  onCreateRoom,
  setNewRoomName,
}: SidebarRoomCreateFormProps) {
  return (
    <form
      className="roomCreateForm"
      onSubmit={(event) => {
        void onCreateRoom(event);
        onCancel();
      }}
    >
      <input
        autoFocus
        value={newRoomName}
        onChange={(event) => setNewRoomName(event.target.value)}
        placeholder="ルーム名"
        aria-label="新しいルーム名"
      />
      <div>
        <button type="submit" disabled={!newRoomName.trim()}>
          作成
        </button>
        <button type="button" onClick={onCancel} aria-label="キャンセル">
          <X size={15} />
        </button>
      </div>
    </form>
  );
}
