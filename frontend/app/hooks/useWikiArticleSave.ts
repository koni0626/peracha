import { createRoomWikiArticle, updateWikiArticle } from "./wikiApi";
import { canSaveWikiArticle, wikiArticleDraftInput } from "./wikiArticleDraftUtils";
import { prependWikiArticle, replaceWikiArticle } from "./wikiArticleListUtils";
import { runSavingMutation } from "./mutationRunner";
import type { UseWikiArticleSaveOptions } from "./wikiArticleMutationTypes";

export function useWikiArticleSave({
  editor,
  roomId,
  saving,
  setActiveArticleId,
  setArticles,
  setError,
  setSaving,
}: UseWikiArticleSaveOptions) {
  async function saveArticle() {
    if (!canSaveWikiArticle(editor.titleDraft, saving, roomId)) {
      return;
    }
    const currentRoomId = roomId;
    if (!currentRoomId) {
      return;
    }
    await runSavingMutation({ fallbackError: "記事を保存できませんでした。", setError, setSaving }, async () => {
      if (editor.creating) {
        const created = await createRoomWikiArticle(
          currentRoomId,
          wikiArticleDraftInput(editor.titleDraft, editor.bodyDraft)
        );
        setArticles((current) => prependWikiArticle(current, created));
        setActiveArticleId(created.id);
        editor.markSavedArticle(created.id);
      } else if (editor.editingArticleId) {
        const updated = await updateWikiArticle(
          editor.editingArticleId,
          wikiArticleDraftInput(editor.titleDraft, editor.bodyDraft)
        );
        setArticles((current) => replaceWikiArticle(current, updated));
        setActiveArticleId(updated.id);
      }
    });
  }

  return { saveArticle };
}
