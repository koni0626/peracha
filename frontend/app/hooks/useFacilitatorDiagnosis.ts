"use client";

import type { FacilitatorDiagnosisOptions } from "./facilitatorDiagnosisTypes";
import { useDiagnosisTextActions } from "./useDiagnosisTextActions";
import { useFacilitatorDiagnosisMutations } from "./useFacilitatorDiagnosisMutations";
import { useFacilitatorDiagnosisState } from "./useFacilitatorDiagnosisState";

export function useFacilitatorDiagnosis({
  activeRoomId,
  draft,
  setChatNotice,
  setDraft,
  setError,
}: FacilitatorDiagnosisOptions) {
  const diagnosisState = useFacilitatorDiagnosisState();
  const { formAnswers, latestDiagnosis, recordDiagnosis, replaceDiagnosisHistory } = diagnosisState;
  const textActions = useDiagnosisTextActions({ latestDiagnosis, setChatNotice, setDraft, setError });
  const diagnosisMutations = useFacilitatorDiagnosisMutations({
    activeRoomId,
    draft,
    formAnswers,
    latestDiagnosis,
    recordDiagnosis,
    replaceDiagnosisHistory,
    setError,
  });

  return {
    latestDiagnosis,
    formAnswers,
    setLatestDiagnosis: diagnosisState.setLatestDiagnosis,
    setFormAnswers: diagnosisState.setFormAnswers,
    diagnosisHistory: diagnosisState.diagnosisHistory,
    setDiagnosisHistory: diagnosisState.setDiagnosisHistory,
    diagnoseDraft: diagnosisMutations.diagnoseDraft,
    submitDynamicForm: diagnosisMutations.submitDynamicForm,
    applyImprovedText: textActions.applyImprovedText,
    copyImprovedText: textActions.copyImprovedText,
    loadDiagnosisHistory: diagnosisMutations.loadDiagnosisHistory,
    resetDiagnosisState: diagnosisState.resetDiagnosisState,
  };
}
