import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

import type { Stamp, StampFolder } from "../types";
import { canOpenStampExplorerMenu } from "./stampExplorerMenuGuards";
import type { StampExplorerContextMenu } from "./stampExplorerTypes";

type UseStampExplorerMenuOptions = {
  canManage: boolean;
  canUpload: boolean;
  onCreateFolder?: (name: string) => void | Promise<void>;
  onDeleteFolder?: (folderId: string) => void | Promise<void>;
  onDeleteStamp?: (stampId: string) => void | Promise<void>;
  stampFolders: StampFolder[];
};

export function useStampExplorerMenu({
  canManage,
  canUpload,
  onCreateFolder,
  onDeleteFolder,
  onDeleteStamp,
  stampFolders,
}: UseStampExplorerMenuOptions) {
  const [contextMenu, setContextMenu] = useState<StampExplorerContextMenu | null>(null);

  useEffect(() => {
    function closeMenu() {
      setContextMenu(null);
    }
    window.addEventListener("click", closeMenu);
    window.addEventListener("keydown", closeMenu);
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("keydown", closeMenu);
    };
  }, []);

  async function createFolder() {
    const name = window.prompt("フォルダ名");
    if (!name?.trim()) {
      return;
    }
    await onCreateFolder?.(name.trim());
    setContextMenu(null);
  }

  async function deleteFolder(folderId: string) {
    const folder = stampFolders.find((item) => item.id === folderId);
    if (!folder || !window.confirm(`フォルダ「${folder.name}」と中のスタンプを削除しますか？`)) {
      return;
    }
    await onDeleteFolder?.(folderId);
    setContextMenu(null);
  }

  async function deleteStamp(stamp: Stamp) {
    if (!window.confirm(`スタンプ「${stamp.title}」を削除しますか？`)) {
      return;
    }
    await onDeleteStamp?.(stamp.id);
    setContextMenu(null);
  }

  function openContextMenu(event: MouseEvent, menu: StampExplorerContextMenu) {
    if (!canOpenStampExplorerMenu({ canManage, canUpload, menu })) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    setContextMenu(menu);
  }

  return {
    contextMenu,
    createFolder,
    deleteFolder,
    deleteStamp,
    openContextMenu,
  };
}
