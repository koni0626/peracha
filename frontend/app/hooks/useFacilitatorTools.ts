"use client";

import type { Dispatch, SetStateAction } from "react";

import { useContextSearch } from "./useContextSearch";
import { useFacilitatorArtifacts } from "./useFacilitatorArtifacts";
import { useFacilitatorDiagnosis } from "./useFacilitatorDiagnosis";
import { useFacilitatorTasks } from "./useFacilitatorTasks";

type UseFacilitatorToolsOptions = {
  activeRoomId: string | null;
  draft: string;
  setDraft: Dispatch<SetStateAction<string>>;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useFacilitatorTools({
  activeRoomId,
  draft,
  setDraft,
  setChatNotice,
  setError
}: UseFacilitatorToolsOptions) {
  const diagnosis = useFacilitatorDiagnosis({
    activeRoomId,
    draft,
    setDraft,
    setChatNotice,
    setError,
  });
  const contextSearch = useContextSearch({ activeRoomId, setError });
  const artifacts = useFacilitatorArtifacts({ activeRoomId, setError });
  const tasks = useFacilitatorTasks({
    activeRoomId,
    latestDiagnosis: diagnosis.latestDiagnosis,
    setError,
  });

  function resetFacilitatorState() {
    diagnosis.resetDiagnosisState();
    contextSearch.resetContextSearchState();
    artifacts.resetArtifactState();
    tasks.resetTaskState();
  }

  return {
    ...diagnosis,
    ...contextSearch,
    ...artifacts,
    ...tasks,
    resetFacilitatorState
  };
}
