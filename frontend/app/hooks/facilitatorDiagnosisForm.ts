import type { Diagnosis } from "../types";

export function hasMissingRequiredDiagnosisAnswer(
  dynamicForm: NonNullable<Diagnosis["dynamic_form"]>,
  formAnswers: Record<string, string>,
) {
  return dynamicForm.some((field) => field.required && !formAnswers[field.id]?.trim());
}
