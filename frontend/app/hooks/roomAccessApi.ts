"use client";

import { apiFetch } from "../api";
import type { Invitation, InvitationAcceptResponse, Page, RoomMember, User } from "../types";

export function fetchRoomMembers(roomId: string) {
  return apiFetch<{ items: RoomMember[] }>(`/api/rooms/${roomId}/members`);
}

export function fetchRoomInvitations(roomId: string) {
  return apiFetch<{ items: Invitation[] }>(`/api/rooms/${roomId}/invitations`);
}

export function createRoomInvitation(roomId: string, email: string, role: string) {
  return apiFetch<Invitation>(`/api/rooms/${roomId}/invitations`, {
    method: "POST",
    body: JSON.stringify({ email, role })
  });
}

export function searchUsersForRoom(roomId: string, query: string) {
  const params = new URLSearchParams({
    q: query,
    exclude_room_id: roomId,
    limit: "10"
  });
  return apiFetch<Page<User>>(`/api/users/search?${params.toString()}`);
}

export function addRoomMember(roomId: string, userId: string, role: string) {
  return apiFetch<RoomMember>(`/api/rooms/${roomId}/members`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, role })
  });
}

export function acceptRoomInvitationToken(token: string) {
  return apiFetch<InvitationAcceptResponse>(`/api/invitations/${token}/accept`, {
    method: "POST"
  });
}

export function revokeRoomInvitation(roomId: string, invitationId: string) {
  return apiFetch<Invitation>(`/api/rooms/${roomId}/invitations/${invitationId}`, {
    method: "DELETE"
  });
}

export function patchRoomMemberRole(roomId: string, memberId: string, role: string) {
  return apiFetch<RoomMember>(`/api/rooms/${roomId}/members/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify({ role })
  });
}

export function deleteRoomMember(roomId: string, memberId: string) {
  return apiFetch<RoomMember>(`/api/rooms/${roomId}/members/${memberId}`, {
    method: "DELETE"
  });
}
