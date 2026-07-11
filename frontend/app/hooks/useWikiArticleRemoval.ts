import type { WikiArticle } from "../types";
import { deleteWikiArticle } from "./wikiApi";
import { nextActiveWikiArticleId, removeWikiArticle } from "./wikiArticleListUtils";
import { runSavingMutation } from "./mutationRunner";
import type { UseWikiArticleRemovalOptions } from "./wikiArticleMutationTypes";

export function useWikiArticleRemoval({
  activeArticleId,
  articles,
  editor,
  saving,
  setActiveArticleId,
  setArticles,
  setError,
  setSaving,
}: UseWikiArticleRemovalOptions) {
  async function removeArticle(article: WikiArticle) {
    if (saving || !window.confirm(`記事「${article.title}」を削除しますか？`)) {
      return;
    }
    await runSavingMutation({ fallbackError: "記事を削除できませんでした。", setError, setSaving }, async () => {
      await deleteWikiArticle(article.id);
      const nextArticles = removeWikiArticle(articles, article.id);
      setArticles(nextArticles);
      setActiveArticleId(nextActiveWikiArticleId(activeArticleId, article.id, nextArticles));
      if (editor.editingArticleId === article.id) {
        editor.cancelEdit();
      }
    });
  }

  return { removeArticle };
}
