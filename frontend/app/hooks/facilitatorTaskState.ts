import type { Task } from "../types";
import { prependUniqueById } from "./idListUtils";

export function upsertTask(tasks: Task[], task: Task) {
  return prependUniqueById(tasks, task, 12);
}

export function taskCandidateKey(diagnosisId: string, index: number, title: string) {
  return `${diagnosisId}:${index}:${title}`;
}

export function taskNotesWithTask(current: Record<string, string>, task: Task) {
  return { ...current, [task.id]: task.progress_note ?? "" };
}

export function addCreatedTaskCandidateKey(current: Set<string>, candidateKey: string) {
  return new Set([...current, candidateKey]);
}

export function taskProgressNoteFromForm(form: HTMLFormElement) {
  const formData = new FormData(form);
  return String(formData.get("progress_note") ?? "");
}
