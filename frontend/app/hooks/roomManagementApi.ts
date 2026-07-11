"use client";

import { apiFetch } from "../api";
import type { Room } from "../types";

export function createRoomForWorkspace(name: string) {
  return apiFetch<Room>("/api/rooms", {
    method: "POST",
    body: JSON.stringify({ name, description: "作業用ルーム" })
  });
}

export function deleteRoomById(roomId: string) {
  return apiFetch<Room>(`/api/rooms/${roomId}`, {
    method: "DELETE"
  });
}

export function updateRoomName(roomId: string, name: string) {
  return apiFetch<Room>(`/api/rooms/${roomId}`, {
    method: "PATCH",
    body: JSON.stringify({ name })
  });
}
