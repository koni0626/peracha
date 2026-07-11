import { History } from "lucide-react";

type WorkTableHistoryButtonProps = {
  expanded: boolean;
  historyCount: number;
  saving: boolean;
  onClick: () => void;
};

export function WorkTableHistoryButton({ expanded, historyCount, saving, onClick }: WorkTableHistoryButtonProps) {
  return (
    <button
      type="button"
      className="workTableHistoryButton"
      onClick={onClick}
      onMouseDown={(event) => event.stopPropagation()}
      disabled={saving}
      draggable={false}
    >
      <History size={12} />
      <span className="workTableHistoryButtonLabel">
        {historyCount > 0 ? `${expanded ? "閉じる" : "履歴"} ${historyCount}` : "履歴作成"}
      </span>
    </button>
  );
}
