import { apiFetch } from "../api";
import type { Diagnosis } from "../types";

export function createManualDiagnosis(roomId: string, text: string) {
  return apiFetch<Diagnosis>("/api/diagnoses", {
    method: "POST",
    body: JSON.stringify({ text, room_id: roomId, source: "manual" }),
  });
}

export function createDynamicFormDiagnosis(roomId: string, diagnosis: Diagnosis, formAnswers: Record<string, string>) {
  return apiFetch<Diagnosis>("/api/diagnoses", {
    method: "POST",
    body: JSON.stringify({
      text: diagnosis.original_text,
      room_id: roomId,
      room_message_id: diagnosis.room_message_id,
      source: "dynamic_form",
      form_answers: formAnswers,
    }),
  });
}

export function fetchDiagnosisHistory(roomId: string) {
  return apiFetch<{ items: Diagnosis[] }>(`/api/diagnoses?room_id=${roomId}`);
}
