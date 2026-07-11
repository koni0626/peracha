import type { Dispatch, SetStateAction } from "react";

import type { WorkTable } from "../types";
import { runSavingMutation } from "./mutationRunner";
import type { SavingMutationOptions } from "./mutationRunner";

export type WorkTableMutationState = {
  activeTable: WorkTable | null;
  saving: boolean;
  setError: Dispatch<SetStateAction<string | null>>;
  setSaving: Dispatch<SetStateAction<boolean>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
};

export type WorkTableListMutationState = {
  saving: boolean;
  tables: WorkTable[];
  setError: Dispatch<SetStateAction<string | null>>;
  setSaving: Dispatch<SetStateAction<boolean>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
};

export async function runWorkTableMutation(
  options: SavingMutationOptions,
  action: () => Promise<void>
) {
  return runSavingMutation(options, action);
}
