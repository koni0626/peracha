import type { MouseEvent } from "react";
import { FileImage } from "lucide-react";

import { apiUrl } from "../api";
import type { Stamp } from "../types";
import type { StampExplorerContextMenu } from "./stampExplorerTypes";

type StampExplorerGridProps = {
  canManage: boolean;
  selectedStampIds: string[];
  stamps: Stamp[];
  onOpenContextMenu: (event: MouseEvent, menu: StampExplorerContextMenu) => void;
  onOpenStamp?: (stamp: Stamp) => void;
  onUseStamp?: (stampId: string) => void;
};

export function StampExplorerGrid({
  canManage,
  selectedStampIds,
  stamps,
  onOpenContextMenu,
  onOpenStamp,
  onUseStamp,
}: StampExplorerGridProps) {
  return (
    <div className="stampExplorerGrid">
      {stamps.map((stamp) => (
        <button
          type="button"
          className={selectedStampIds.includes(stamp.id) ? "active" : ""}
          key={stamp.id}
          title={stamp.title}
          onClick={() => onOpenStamp?.(stamp)}
          onDoubleClick={() => onUseStamp?.(stamp.id)}
          onContextMenu={(event) => onOpenContextMenu(event, { x: event.clientX, y: event.clientY, target: "stamp", stamp })}
        >
          <img src={apiUrl(stamp.image_url)} alt={stamp.title} />
        </button>
      ))}
      {stamps.length === 0 ? <StampExplorerEmpty canManage={canManage} /> : null}
    </div>
  );
}

function StampExplorerEmpty({ canManage }: { canManage: boolean }) {
  return (
    <div className="stampExplorerEmpty">
      <FileImage size={30} />
      <span>{canManage ? "画像をドラッグ&ドロップしてください" : "このフォルダにはスタンプがありません"}</span>
    </div>
  );
}
