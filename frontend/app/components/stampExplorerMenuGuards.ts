import type { StampExplorerContextMenu } from "./stampExplorerTypes";

export function canOpenStampExplorerMenu({
  canManage,
  canUpload,
  menu,
}: {
  canManage: boolean;
  canUpload: boolean;
  menu: StampExplorerContextMenu;
}) {
  return canManage || (canUpload && menu.target !== "stamp");
}
