import type { Board, BoardSuggestion, CareIntervention, Diagnosis, Task, WsEvent } from "../types";
import type { RealtimeEventContext } from "./realtimeEventTypes";
import { prependUniqueById } from "./realtimeListUtils";

export function handleRealtimeArtifactEvent(payload: WsEvent, context: RealtimeEventContext) {
  if (payload.event === "diagnosis.completed" || payload.event === "facilitator.intervened") {
    applyDiagnosisEvent(payload.data as Diagnosis, context);
    return;
  }
  if (payload.event === "care.created") {
    applyCareEvent(payload.data as CareIntervention, context);
    return;
  }
  if (payload.event === "board.created") {
    applyBoardCreated(payload.data as Board, context);
    return;
  }
  if (payload.event === "board.suggested") {
    context.setBoardSuggestion(payload.data as BoardSuggestion);
    return;
  }
  if (payload.event === "task.created" || payload.event === "task.updated") {
    applyTaskEvent(payload.data as Task, context);
  }
}

function applyDiagnosisEvent(diagnosis: Diagnosis, context: RealtimeEventContext) {
  context.setLatestDiagnosis(diagnosis);
  context.setDiagnosisHistory((current) => prependUniqueById(current, diagnosis, 10));
}

function applyCareEvent(care: CareIntervention, context: RealtimeEventContext) {
  context.setLatestCare(care);
  context.setCareHistory((current) => prependUniqueById(current, care, 10));
}

function applyBoardCreated(board: Board, context: RealtimeEventContext) {
  context.setLatestBoard(board);
  context.setBoardSuggestion(null);
}

function applyTaskEvent(task: Task, context: RealtimeEventContext) {
  context.setTasks((current) => prependUniqueById(current, task, 12));
}
