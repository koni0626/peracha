import type { Diagnosis } from "../types";
import { prependUniqueById } from "./idListUtils";

export function prependDiagnosisHistory(current: Diagnosis[], diagnosis: Diagnosis) {
  return prependUniqueById(current, diagnosis, 10);
}

export function latestDiagnosisFromHistory(current: Diagnosis | null, history: Diagnosis[]) {
  return history[0] ?? current;
}
