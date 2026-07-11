import { writeClipboardText } from "../clipboard";
import type { Diagnosis } from "../types";

export async function copyDiagnosisImprovedText(diagnosis: Diagnosis | null) {
  if (!diagnosis) {
    return false;
  }
  return writeClipboardText(diagnosis.improved_text);
}
