"use client";

import { apiUrl } from "../api";
import type { Attachment, PeraichiImageResult, RoomFile, StampUse } from "../types";

export function roomFileToAttachment(file: RoomFile): Attachment {
  return {
    title: file.original_name,
    url: apiUrl(file.download_url),
    content_type: file.content_type,
    size_bytes: file.size_bytes,
    description: "ルームフォルダに保存済み"
  };
}

export function peraichiImageToAttachment(image: PeraichiImageResult): Attachment {
  return {
    title: image.file.original_name,
    url: apiUrl(image.file.download_url),
    content_type: image.file.content_type,
    size_bytes: image.file.size_bytes,
    description: "ペライチ画像"
  };
}

export function buildMessageBody(body: string, attachments: Attachment[], stamps: StampUse[]) {
  return (
    body.trim() ||
    (attachments.length > 0 ? "\u200b" : "") ||
    (stamps.length > 0 ? "スタンプを送信しました" : "")
  );
}
