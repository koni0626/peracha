import type { FormEvent } from "react";

import { createDynamicFormDiagnosis, createManualDiagnosis, fetchDiagnosisHistory } from "./facilitatorDiagnosisApi";
import { hasMissingRequiredDiagnosisAnswer } from "./facilitatorDiagnosisForm";
import type { FacilitatorDiagnosisMutationOptions } from "./facilitatorDiagnosisTypes";
import { getErrorMessage } from "./mutationRunner";

export function useFacilitatorDiagnosisMutations({
  activeRoomId,
  draft,
  formAnswers,
  latestDiagnosis,
  recordDiagnosis,
  replaceDiagnosisHistory,
  setError,
}: FacilitatorDiagnosisMutationOptions) {
  async function diagnoseDraft() {
    if (!activeRoomId || !draft.trim()) {
      return;
    }
    setError(null);
    try {
      recordDiagnosis(await createManualDiagnosis(activeRoomId, draft));
    } catch (err) {
      setError(getErrorMessage(err, "診断に失敗しました。"));
    }
  }

  async function submitDynamicForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeRoomId || !latestDiagnosis?.dynamic_form) {
      return;
    }

    if (hasMissingRequiredDiagnosisAnswer(latestDiagnosis.dynamic_form, formAnswers)) {
      setError("必須項目を入力してください。");
      return;
    }

    setError(null);
    try {
      recordDiagnosis(await createDynamicFormDiagnosis(activeRoomId, latestDiagnosis, formAnswers));
    } catch (err) {
      setError(getErrorMessage(err, "フォーム回答の反映に失敗しました。"));
    }
  }

  async function loadDiagnosisHistory() {
    if (!activeRoomId) {
      return;
    }
    setError(null);
    try {
      const data = await fetchDiagnosisHistory(activeRoomId);
      replaceDiagnosisHistory(data.items);
    } catch (err) {
      setError(getErrorMessage(err, "診断履歴の取得に失敗しました。"));
    }
  }

  return {
    diagnoseDraft,
    loadDiagnosisHistory,
    submitDynamicForm,
  };
}
