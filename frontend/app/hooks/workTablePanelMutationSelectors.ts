import type { WorkTable } from "../types";
import type { WorkTablesPanelState } from "./workTablePanelActionSelectorTypes";
import type { WorkTableListMutationState, WorkTableMutationState } from "./workTableMutationUtils";

export function selectWorkTableMutationState(
  activeTable: WorkTable | null,
  state: WorkTablesPanelState
): WorkTableMutationState {
  return {
    activeTable,
    saving: state.saving,
    setError: state.setError,
    setSaving: state.setSaving,
    setTables: state.setTables,
  };
}

export function selectWorkTableListMutationState(state: WorkTablesPanelState): WorkTableListMutationState {
  return {
    saving: state.saving,
    tables: state.tables,
    setError: state.setError,
    setSaving: state.setSaving,
    setTables: state.setTables,
  };
}
