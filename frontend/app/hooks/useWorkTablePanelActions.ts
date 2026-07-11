import type { WorkTable, WorkTableRecord } from "../types";
import { useWorkTableColumnActions } from "./useWorkTableColumnActions";
import { useWorkTableRecordActions } from "./useWorkTableRecordActions";
import { useWorkTableTableActions } from "./useWorkTableTableActions";
import type { useWorkTablesPanelState } from "./useWorkTablesPanelState";
import {
  selectWorkTableColumnActionOptions,
  selectWorkTableRecordActionOptions,
  selectWorkTableTableActionOptions,
} from "./workTablePanelActionSelectors";

type UseWorkTablePanelActionsOptions = {
  activeRecords: WorkTableRecord[];
  activeTable: WorkTable | null;
  canReorderRecords: boolean;
  roomId: string | null;
  state: ReturnType<typeof useWorkTablesPanelState>;
};

export function useWorkTablePanelActions({
  activeRecords,
  activeTable,
  canReorderRecords,
  roomId,
  state,
}: UseWorkTablePanelActionsOptions) {
  const tableActions = useWorkTableTableActions(selectWorkTableTableActionOptions(roomId, state));
  const columnActions = useWorkTableColumnActions(selectWorkTableColumnActionOptions(activeTable, state));
  const recordActions = useWorkTableRecordActions(
    selectWorkTableRecordActionOptions({
      activeRecords,
      activeTable,
      canReorderRecords,
      roomId,
      state,
    })
  );

  return {
    columnActions,
    recordActions,
    tableActions,
  };
}
