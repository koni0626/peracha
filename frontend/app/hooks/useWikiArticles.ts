import { useEffect, useMemo, useState } from "react";

import type { WikiArticle } from "../types";
import { activeWikiArticle } from "./wikiArticleListUtils";
import { useWikiArticleEditorState } from "./useWikiArticleEditorState";
import { useWikiArticleLoader } from "./useWikiArticleLoader";
import { useWikiArticleMutations } from "./useWikiArticleMutations";

export function useWikiArticles(roomId: string | null) {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editor = useWikiArticleEditorState(roomId);
  const { loading } = useWikiArticleLoader({
    roomId,
    setActiveArticleId,
    setArticles,
    setError,
  });

  const activeArticle = useMemo(
    () => activeWikiArticle(articles, activeArticleId),
    [activeArticleId, articles]
  );
  const { removeArticle, saveArticle } = useWikiArticleMutations({
    activeArticleId,
    articles,
    editor,
    roomId,
    saving,
    setActiveArticleId,
    setArticles,
    setError,
    setSaving,
  });

  function startCreate() {
    editor.startCreate();
    setError(null);
  }

  function startEdit(article: WikiArticle) {
    setActiveArticleId(article.id);
    editor.startEdit(article);
    setError(null);
  }

  function selectArticle(articleId: string) {
    setActiveArticleId(articleId);
    const article = articles.find((item) => item.id === articleId);
    if (article) {
      editor.startEdit(article);
      setError(null);
    }
  }

  useEffect(() => {
    if (loading || editor.isEditing || !activeArticle) {
      return;
    }
    editor.startEdit(activeArticle);
  }, [activeArticle, editor, loading]);

  useEffect(() => {
    if (!roomId || loading || saving || !editor.isEditing || !editor.titleDraft.trim()) {
      return;
    }
    if (
      editor.editingArticleId &&
      activeArticle?.id === editor.editingArticleId &&
      activeArticle.title === editor.titleDraft.trim() &&
      activeArticle.body_markdown === editor.bodyDraft
    ) {
      return;
    }
    if (editor.creating && !editor.titleDraft.trim() && !editor.bodyDraft.trim()) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void saveArticle();
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [
    activeArticle?.body_markdown,
    activeArticle?.id,
    activeArticle?.title,
    editor.bodyDraft,
    editor.creating,
    editor.editingArticleId,
    editor.isEditing,
    editor.titleDraft,
    loading,
    roomId,
    saveArticle,
    saving,
  ]);

  return {
    activeArticle,
    articles,
    bodyDraft: editor.bodyDraft,
    creating: editor.creating,
    error,
    isEditing: editor.isEditing,
    loading,
    saving,
    titleDraft: editor.titleDraft,
    cancelEdit: editor.cancelEdit,
    removeArticle,
    saveArticle,
    selectArticle,
    setBodyDraft: editor.setBodyDraft,
    setTitleDraft: editor.setTitleDraft,
    startCreate,
    startEdit,
  };
}
