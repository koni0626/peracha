import type { Dispatch, SetStateAction } from "react";

import type { RecordContextMenuState } from "../components/workTablePanelTypes";
import type { WorkTableRecord } from "../types";
import type { WorkTableMutationState } from "./workTableMutationUtils";

export type UseWorkTableRecordOrderingOptions = WorkTableMutationState & {
  activeRecords: WorkTableRecord[];
  canReorderRecords: boolean;
  draggedRecordId: string | null;
  setDraggedRecordId: Dispatch<SetStateAction<string | null>>;
  setRecordContextMenu: Dispatch<SetStateAction<RecordContextMenuState | null>>;
};

export type UseWorkTableRecordInsertionOptions = Pick<
  UseWorkTableRecordOrderingOptions,
  "activeRecords" | "activeTable" | "saving" | "setError" | "setRecordContextMenu" | "setSaving" | "setTables"
>;

export type UseWorkTableRecordReorderOptions = Pick<
  UseWorkTableRecordOrderingOptions,
  | "activeRecords"
  | "activeTable"
  | "canReorderRecords"
  | "draggedRecordId"
  | "saving"
  | "setDraggedRecordId"
  | "setError"
  | "setSaving"
  | "setTables"
>;
