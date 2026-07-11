"use client";

import { apiFetch, apiUrl, readResponseErrorDetail } from "../api";
import type { MeResponse, User } from "../types";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export function registerSession(input: RegisterInput) {
  return apiFetch<MeResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function loginSession(input: LoginInput) {
  return apiFetch<MeResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function fetchCurrentSession() {
  return apiFetch<MeResponse>("/api/auth/me");
}

export function logoutCurrentSession() {
  return apiFetch<{ status: string }>("/api/auth/logout", {
    method: "POST"
  });
}

export async function uploadCurrentUserAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(apiUrl("/api/users/me/avatar"), {
    method: "POST",
    credentials: "include",
    body: formData
  });

  if (!response.ok) {
    const detail = await readResponseErrorDetail(response);
    throw new Error(toAvatarUploadMessage(detail, response.status));
  }

  return response.json() as Promise<User>;
}

function toAvatarUploadMessage(detail: string, status: number) {
  if (status === 413 || detail === "Avatar image is too large") {
    return "顔アイコン画像が大きすぎます。8MB以下の画像を選んでください。";
  }
  if (detail === "Unsupported avatar image type") {
    return "PNG、JPEG、WebP、GIFの画像を選んでください。";
  }
  return detail || `顔アイコンの更新に失敗しました (${status})`;
}
