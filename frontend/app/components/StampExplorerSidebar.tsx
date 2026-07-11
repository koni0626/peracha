import type { MouseEvent } from "react";
import { Folder } from "lucide-react";

import type { StampExplorerContextMenu, StampFolderEntry } from "./stampExplorerTypes";
import { ROOT_FOLDER_ID } from "./stampExplorerTypes";

type StampExplorerSidebarProps = {
  activeFolderId: string | null;
  folders: StampFolderEntry[];
  rootActive: boolean;
  stampCount: number;
  onOpenContextMenu: (event: MouseEvent, menu: StampExplorerContextMenu) => void;
  onSelectFolder: (folderId: string | null) => void;
};

export function StampExplorerSidebar({
  activeFolderId,
  folders,
  rootActive,
  stampCount,
  onOpenContextMenu,
  onSelectFolder,
}: StampExplorerSidebarProps) {
  return (
    <aside className="stampExplorerSidebar" onContextMenu={(event) => onOpenContextMenu(event, { x: event.clientX, y: event.clientY, target: "blank" })}>
      <button
        type="button"
        className={`stampExplorerRoot ${rootActive ? "active" : ""}`}
        onClick={() => onSelectFolder(ROOT_FOLDER_ID)}
        onContextMenu={(event) => onOpenContextMenu(event, { x: event.clientX, y: event.clientY, target: "blank" })}
      >
        <Folder size={17} />
        <span>スタンプ</span>
        <small>{stampCount}</small>
      </button>
      <div className="stampExplorerFolders">
        {folders.map((folder) => (
          <button
            type="button"
            className={activeFolderId === folder.id ? "active" : ""}
            key={folder.id ?? "uncategorized"}
            onClick={() => onSelectFolder(folder.id)}
            onContextMenu={(event) =>
              folder.id
                ? onOpenContextMenu(event, { x: event.clientX, y: event.clientY, target: "folder", folderId: folder.id })
                : onOpenContextMenu(event, { x: event.clientX, y: event.clientY, target: "blank" })
            }
          >
            <Folder size={16} />
            <span>{folder.name}</span>
            <small>{folder.count}</small>
          </button>
        ))}
      </div>
    </aside>
  );
}
