import type { Dispatch, SetStateAction } from "react";

import type { Diagnosis } from "../types";

export type FacilitatorDiagnosisOptions = {
  activeRoomId: string | null;
  draft: string;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setDraft: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export type FacilitatorDiagnosisMutationOptions = {
  activeRoomId: string | null;
  draft: string;
  formAnswers: Record<string, string>;
  latestDiagnosis: Diagnosis | null;
  recordDiagnosis: (diagnosis: Diagnosis) => void;
  replaceDiagnosisHistory: (history: Diagnosis[]) => void;
  setError: Dispatch<SetStateAction<string | null>>;
};
