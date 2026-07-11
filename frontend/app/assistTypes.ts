import type { RoomFile } from "./chatTypes";

export type Diagnosis = {
  id: string;
  room_id: string | null;
  room_message_id: string | null;
  original_text: string;
  improved_text: string;
  message_type: string;
  clarity_score: number;
  garbage_score: number;
  context_confidence_score: number;
  facilitator_state: string;
  facilitator_message: string | null;
  inferred_subject: string | null;
  reason: string;
  detected_terms: { term: string; reason: string }[];
  missing_items: { item: string; description: string }[];
  related_contexts: { id: string; title: string; excerpt: string; confidence: number }[];
  dynamic_form: { id: string; label: string; type: string; required: boolean; options: string[] }[] | null;
  task_candidates: { title: string; assignee: string | null; due_date: string | null; completion_condition: string | null }[];
  created_at: string;
};

export type Board = {
  id: string;
  room_id: string;
  title: string;
  image_url: string;
  image_model: string;
  summary_json: Record<string, string[] | string>;
  created_at: string;
};

export type BoardSuggestion = {
  room_id: string;
  trigger: string;
  reason: string;
  message_ids: string[];
  suggested_at: string;
};

export type MessageRewriteResult = {
  original_text: string;
  improved_text: string;
  diagnosis_id: string | null;
};

export type PeraichiImageResult = {
  title: string;
  file: RoomFile;
};

export type RelatedContext = {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  url: string | null;
  confidence: number;
};

export type CareIntervention = {
  id: string;
  room_id: string;
  care_type: string;
  emotional_summary: string | null;
  issue_summary: string;
  fact_check_points: string[];
  decision_criteria: string[];
  facilitator_reply: string;
  suggest_board: boolean;
  created_at: string;
};

export type Task = {
  id: string;
  room_id: string;
  diagnosis_id: string | null;
  room_message_id: string | null;
  title: string;
  assignee: string | null;
  due_date: string | null;
  status: string;
  completion_condition: string | null;
  progress_note: string | null;
  result_message_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};
