export type WikiArticle = {
  id: string;
  room_id: string;
  title: string;
  body_markdown: string;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
};
