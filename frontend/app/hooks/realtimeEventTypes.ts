import type { Dispatch, RefObject, SetStateAction } from "react";

import type { Board, BoardSuggestion, CareIntervention, Diagnosis, Message, Room, Task, User } from "../types";

export type RealtimeEventContext = {
  activeRoomId: string;
  activeRoomIdRef: RefObject<string | null>;
  user: User;
  roomMessageCursorRef: RefObject<Record<string, string | null>>;
  setActiveRoomId: Dispatch<SetStateAction<string | null>>;
  setRooms: Dispatch<SetStateAction<Room[]>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setLatestDiagnosis: Dispatch<SetStateAction<Diagnosis | null>>;
  setDiagnosisHistory: Dispatch<SetStateAction<Diagnosis[]>>;
  setLatestCare: Dispatch<SetStateAction<CareIntervention | null>>;
  setCareHistory: Dispatch<SetStateAction<CareIntervention[]>>;
  setLatestBoard: Dispatch<SetStateAction<Board | null>>;
  setBoardSuggestion: Dispatch<SetStateAction<BoardSuggestion | null>>;
  setChatNotice: Dispatch<SetStateAction<string | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  resetAccessState: () => void;
  mergeMessages: (items: Message[]) => void;
  markRoomRead: (messageId?: string | null) => Promise<void>;
  fetchMessages: (since?: string | null, markRead?: boolean) => Promise<void>;
};
