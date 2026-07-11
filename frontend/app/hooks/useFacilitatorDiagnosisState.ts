import { useState } from "react";

import type { Diagnosis } from "../types";
import { latestDiagnosisFromHistory, prependDiagnosisHistory } from "./facilitatorDiagnosisState";

export function useFacilitatorDiagnosisState() {
  const [latestDiagnosis, setLatestDiagnosis] = useState<Diagnosis | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [diagnosisHistory, setDiagnosisHistory] = useState<Diagnosis[]>([]);

  function recordDiagnosis(diagnosis: Diagnosis) {
    setLatestDiagnosis(diagnosis);
    setDiagnosisHistory((current) => prependDiagnosisHistory(current, diagnosis));
  }

  function replaceDiagnosisHistory(history: Diagnosis[]) {
    setDiagnosisHistory(history);
    setLatestDiagnosis((current) => latestDiagnosisFromHistory(current, history));
  }

  function resetDiagnosisState() {
    setLatestDiagnosis(null);
    setFormAnswers({});
    setDiagnosisHistory([]);
  }

  return {
    diagnosisHistory,
    formAnswers,
    latestDiagnosis,
    recordDiagnosis,
    replaceDiagnosisHistory,
    resetDiagnosisState,
    setDiagnosisHistory,
    setFormAnswers,
    setLatestDiagnosis,
  };
}
