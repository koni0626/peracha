import { X } from "lucide-react";

type ThreadPanelHeaderProps = {
  replyCount: number;
  onClose: () => void;
};

export function ThreadPanelHeader({ replyCount, onClose }: ThreadPanelHeaderProps) {
  return (
    <header className="threadPanelHeader">
      <div>
        <strong>スレッド</strong>
        <span>{replyCount} 件の返信</span>
      </div>
      <button type="button" title="閉じる" onClick={onClose}>
        <X size={17} />
      </button>
    </header>
  );
}
