import type { User } from "./userRoomTypes";

export type Message = {
  id: string;
  room_id: string;
  sender_user_id: string | null;
  sender_type: string;
  sender_name: string | null;
  sender_avatar_url: string | null;
  body: string;
  thread_id: string | null;
  reply_to: MessageReply | null;
  thread_reply_count: number;
  attachments: Attachment[];
  stamps: StampUse[];
  metadata: MessageMetadata | null;
  read_status: string;
  read_count: number;
  created_at: string;
};

export type MessageReply = {
  id: string;
  sender_name: string | null;
  body: string;
  created_at: string;
};

export type MessageMetadata = {
  mentions?: User[];
  mention_all?: boolean;
  [key: string]: unknown;
};

export type Attachment = {
  title: string;
  url: string;
  content_type: string | null;
  size_bytes: number | null;
  description: string | null;
};

export type StampUse = {
  id: string;
  title: string;
  image_url: string;
};

export type Stamp = StampUse & {
  folder_id: string | null;
  prompt: string;
  image_model: string;
  reference_used: boolean;
  created_at: string;
};

export type StampFolder = {
  id: string;
  name: string;
  stamp_count: number;
  created_at: string;
};

export type RoomFile = {
  id: string;
  room_id: string;
  original_name: string;
  content_type: string | null;
  size_bytes: number;
  download_url: string;
  preview_url: string | null;
  preview_kind: string;
  created_at: string;
};

export type RoomFilePreview = {
  file_id: string;
  preview_kind: string;
  text: string;
  truncated: boolean;
};
