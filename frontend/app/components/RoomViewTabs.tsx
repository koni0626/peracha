import type { RoomViewKind } from "./roomViewTypes";

type RoomViewTabsProps = {
  activeView: RoomViewKind;
  setActiveView: (view: RoomViewKind) => void;
};

const ROOM_VIEW_TABS: Array<{ kind: RoomViewKind; label: string }> = [
  { kind: "chat", label: "チャット" },
  { kind: "tables", label: "テーブル" },
  { kind: "wiki", label: "ノート" },
  { kind: "apps", label: "アプリ" },
];

export function RoomViewTabs({ activeView, setActiveView }: RoomViewTabsProps) {
  return (
    <nav className="roomViewTabs" aria-label="ルームビュー">
      {ROOM_VIEW_TABS.map((tab) => (
        <button
          type="button"
          className={activeView === tab.kind ? "active" : ""}
          key={tab.kind}
          onClick={() => setActiveView(tab.kind)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
