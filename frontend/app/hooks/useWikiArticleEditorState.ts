import { useEffect, useState } from "react";

import type { WikiArticle } from "../types";

export function useWikiArticleEditorState(roomId: string | null) {
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [bodyDraft, setBodyDraft] = useState("");

  const isEditing = creating || editingArticleId !== null;

  useEffect(() => {
    cancelEdit();
  }, [roomId]);

  function startCreate() {
    setCreating(true);
    setEditingArticleId(null);
    setTitleDraft("");
    setBodyDraft("");
  }

  function startEdit(article: WikiArticle) {
    setCreating(false);
    setEditingArticleId(article.id);
    setTitleDraft(article.title);
    setBodyDraft(article.body_markdown);
  }

  function markSavedArticle(articleId: string) {
    setCreating(false);
    setEditingArticleId(articleId);
  }

  function cancelEdit() {
    setCreating(false);
    setEditingArticleId(null);
    setTitleDraft("");
    setBodyDraft("");
  }

  return {
    bodyDraft,
    creating,
    editingArticleId,
    isEditing,
    titleDraft,
    cancelEdit,
    setBodyDraft,
    setTitleDraft,
    markSavedArticle,
    startCreate,
    startEdit,
  };
}
