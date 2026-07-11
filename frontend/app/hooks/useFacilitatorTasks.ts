"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Diagnosis, Task } from "../types";
import { createTaskFromDiagnosisCandidate, fetchTasksForRoom, patchTask } from "./facilitatorTaskApi";
import {
  addCreatedTaskCandidateKey,
  taskCandidateKey,
  taskNotesWithTask,
  taskProgressNoteFromForm,
  upsertTask,
} from "./facilitatorTaskState";
import { getErrorMessage } from "./mutationRunner";
import { useFacilitatorTaskState } from "./useFacilitatorTaskState";

type UseFacilitatorTasksOptions = {
  activeRoomId: string | null;
  latestDiagnosis: Diagnosis | null;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useFacilitatorTasks({
  activeRoomId,
  latestDiagnosis,
  setError,
}: UseFacilitatorTasksOptions) {
  const taskState = useFacilitatorTaskState();
  const { setCreatedTaskCandidateKeys, setTaskNotes, setTasks } = taskState;

  async function loadTasks(roomId = activeRoomId) {
    if (!roomId) {
      return;
    }
    setError(null);
    try {
      const data = await fetchTasksForRoom(roomId);
      setTasks(data.items);
    } catch (err) {
      setError(getErrorMessage(err, "タスク取得に失敗しました"));
    }
  }

  async function updateTask(taskId: string, payload: Partial<Pick<Task, "status" | "progress_note">>) {
    setError(null);
    try {
      const task = await patchTask(taskId, payload);
      setTasks((current) => upsertTask(current, task));
      setTaskNotes((current) => taskNotesWithTask(current, task));
    } catch (err) {
      setError(getErrorMessage(err, "タスク更新に失敗しました"));
    }
  }

  async function createTaskFromCandidate(candidate: Diagnosis["task_candidates"][number], index: number) {
    if (!activeRoomId || !latestDiagnosis) {
      return;
    }
    const candidateKey = taskCandidateKey(latestDiagnosis.id, index, candidate.title);
    setError(null);
    try {
      const task = await createTaskFromDiagnosisCandidate(activeRoomId, latestDiagnosis, candidate);
      setTasks((current) => upsertTask(current, task));
      setCreatedTaskCandidateKeys((current) => addCreatedTaskCandidateKey(current, candidateKey));
    } catch (err) {
      setError(getErrorMessage(err, "タスク作成に失敗しました"));
    }
  }

  function saveTaskProgress(event: FormEvent<HTMLFormElement>, taskId: string) {
    event.preventDefault();
    updateTask(taskId, { progress_note: taskProgressNoteFromForm(event.currentTarget) });
  }

  return {
    tasks: taskState.tasks,
    setTasks,
    taskNotes: taskState.taskNotes,
    setTaskNotes,
    createdTaskCandidateKeys: taskState.createdTaskCandidateKeys,
    loadTasks,
    updateTask,
    createTaskFromCandidate,
    saveTaskProgress,
    resetTaskState: taskState.resetTaskState,
  };
}
