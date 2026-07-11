import { useState } from "react";

import type { Task } from "../types";

export function useFacilitatorTaskState() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});
  const [createdTaskCandidateKeys, setCreatedTaskCandidateKeys] = useState<Set<string>>(new Set());

  function resetTaskState() {
    setTasks([]);
    setTaskNotes({});
    setCreatedTaskCandidateKeys(new Set());
  }

  return {
    createdTaskCandidateKeys,
    resetTaskState,
    setCreatedTaskCandidateKeys,
    setTaskNotes,
    setTasks,
    taskNotes,
    tasks,
  };
}
