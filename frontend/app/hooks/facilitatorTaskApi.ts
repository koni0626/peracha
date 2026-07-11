import { apiFetch } from "../api";
import type { Diagnosis, Task } from "../types";

export function fetchTasksForRoom(roomId: string) {
  return apiFetch<{ items: Task[] }>(`/api/tasks?room_id=${roomId}`);
}

export function patchTask(taskId: string, payload: Partial<Pick<Task, "status" | "progress_note">>) {
  return apiFetch<Task>(`/api/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function createTaskFromDiagnosisCandidate(
  roomId: string,
  diagnosis: Diagnosis,
  candidate: Diagnosis["task_candidates"][number],
) {
  return apiFetch<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify({
      room_id: roomId,
      diagnosis_id: diagnosis.id,
      room_message_id: diagnosis.room_message_id,
      title: candidate.title,
      assignee: candidate.assignee,
      due_date: candidate.due_date,
      completion_condition: candidate.completion_condition,
      metadata: { source: "diagnosis_candidate", diagnosis_id: diagnosis.id },
    }),
  });
}
