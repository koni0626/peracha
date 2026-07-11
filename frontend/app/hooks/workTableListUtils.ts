import type { WorkTable } from "../types";
import { pickCurrentOrFirstId, replaceById } from "./idListUtils";

export function replaceWorkTable(tables: WorkTable[], replacement: WorkTable) {
  return replaceById(tables, replacement);
}

export function pickCurrentOrFirstWorkTableId(tables: WorkTable[], currentId: string | null) {
  return pickCurrentOrFirstId(tables, currentId);
}
