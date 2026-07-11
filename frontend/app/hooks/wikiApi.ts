import { apiFetch } from "../api";
import type { Page, WikiArticle } from "../types";

export function fetchRoomWikiArticles(roomId: string) {
  return apiFetch<Page<WikiArticle>>(`/api/rooms/${roomId}/wiki-articles`);
}

export function createRoomWikiArticle(roomId: string, input: { title: string; body_markdown: string }) {
  return apiFetch<WikiArticle>(`/api/rooms/${roomId}/wiki-articles`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateWikiArticle(articleId: string, input: { title?: string; body_markdown?: string }) {
  return apiFetch<WikiArticle>(`/api/wiki-articles/${articleId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteWikiArticle(articleId: string) {
  return apiFetch<WikiArticle>(`/api/wiki-articles/${articleId}`, {
    method: "DELETE",
  });
}
