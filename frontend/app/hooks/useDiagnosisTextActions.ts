import type { Dispatch, SetStateAction } from "react";

import type { Diagnosis } from "../types";
import { copyDiagnosisImprovedText } from "./facilitatorDiagnosisClipboard";

type UseDiagnosisTextActionsOptions = {
  latestDiagnosis: Diagnosis | null;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setDraft: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useDiagnosisTextActions({
  latestDiagnosis,
  setChatNotice,
  setDraft,
  setError,
}: UseDiagnosisTextActionsOptions) {
  function applyImprovedText() {
    if (!latestDiagnosis) {
      return;
    }
    setDraft(latestDiagnosis.improved_text);
    setChatNotice("改善文を下書きに反映しました。");
  }

  async function copyImprovedText() {
    if (!latestDiagnosis) {
      return;
    }
    if (await copyDiagnosisImprovedText(latestDiagnosis)) {
      setChatNotice("改善文をコピーしました。");
      setError(null);
    } else {
      setError("クリップボードへのコピーに失敗しました。");
    }
  }

  return { applyImprovedText, copyImprovedText };
}
