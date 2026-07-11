import { WorkTableColumnContextMenu } from "./WorkTableMenus";
import { columnForContextMenu } from "./workTableMenuSlotUtils";
import type { ColumnContextMenuSlotProps } from "./workTableMenuSlotTypes";

export function ColumnContextMenuSlot({
  activeTable,
  menu,
  openColumnCreator,
}: ColumnContextMenuSlotProps) {
  const column = columnForContextMenu(activeTable, menu);
  if (!column) {
    return null;
  }
  return (
    <WorkTableColumnContextMenu
      column={column}
      menu={menu}
      onAddLeft={(targetColumn) => openColumnCreator(targetColumn, "left")}
      onAddRight={(targetColumn) => openColumnCreator(targetColumn, "right")}
    />
  );
}
