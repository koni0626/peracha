export function canSaveWikiArticle(titleDraft: string, saving: boolean, roomId: string | null) {
  return Boolean(roomId && titleDraft.trim() && !saving);
}

export function wikiArticleDraftInput(titleDraft: string, bodyDraft: string) {
  return {
    title: titleDraft.trim(),
    body_markdown: bodyDraft,
  };
}
