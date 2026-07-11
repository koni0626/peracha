import { Home as HomeIcon, Plus } from "lucide-react";

type SidebarHomeRoomButtonProps = {
  activeRoomId: string | null;
  setActiveRoomId: (roomId: string | null) => void;
};

type SidebarRoomAddButtonProps = {
  onStartCreate: () => void;
};

export function SidebarHomeRoomButton({ activeRoomId, setActiveRoomId }: SidebarHomeRoomButtonProps) {
  return (
    <button
      className={!activeRoomId ? "roomButton active" : "roomButton"}
      type="button"
      onClick={() => setActiveRoomId(null)}
    >
      <HomeIcon size={15} />
      <span className="roomButtonText">
        <strong>ホーム</strong>
      </span>
    </button>
  );
}

export function SidebarRoomAddButton({ onStartCreate }: SidebarRoomAddButtonProps) {
  return (
    <button className="roomAddButton" type="button" onClick={onStartCreate} aria-label="ルームを作成">
      <Plus size={18} />
    </button>
  );
}
