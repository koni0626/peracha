import { WorkTableRecordContextMenu } from "./WorkTableMenus";
import { recordForContextMenu } from "./workTableMenuSlotUtils";
import type { RecordContextMenuSlotProps } from "./workTableMenuSlotTypes";

export function RecordContextMenuSlot({
  activeRecords,
  insertRecordAt,
  insertRecordNear,
  menu,
}: RecordContextMenuSlotProps) {
  const record = recordForContextMenu(activeRecords, menu);
  if (menu.recordId && !record) {
    return null;
  }
  return (
    <WorkTableRecordContextMenu
      menu={menu}
      record={record}
      onAddFirst={() => insertRecordAt(1)}
      onAddAbove={(targetRecord) => insertRecordNear(targetRecord, "above")}
      onAddBelow={(targetRecord) => insertRecordNear(targetRecord, "below")}
    />
  );
}
