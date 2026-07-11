import { useWikiArticleRemoval } from "./useWikiArticleRemoval";
import { useWikiArticleSave } from "./useWikiArticleSave";
import type { UseWikiArticleMutationsOptions } from "./wikiArticleMutationTypes";

export function useWikiArticleMutations({
  activeArticleId,
  articles,
  editor,
  roomId,
  saving,
  setActiveArticleId,
  setArticles,
  setError,
  setSaving,
}: UseWikiArticleMutationsOptions) {
  const { saveArticle } = useWikiArticleSave({
    editor,
    roomId,
    saving,
    setActiveArticleId,
    setArticles,
    setError,
    setSaving,
  });
  const { removeArticle } = useWikiArticleRemoval({
    activeArticleId,
    articles,
    editor,
    saving,
    setActiveArticleId,
    setArticles,
    setError,
    setSaving,
  });

  return {
    removeArticle,
    saveArticle,
  };
}
