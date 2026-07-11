import { useWikiArticles } from "../hooks/useWikiArticles";
import { WikiArticleView, WikiEditor, WikiEmptyState } from "./WikiArticleContent";
import { WikiArticleList } from "./WikiArticleList";

type WikiPanelProps = {
  roomId: string | null;
  onUploadInlineFile: (file: File) => Promise<{ title: string; url: string; content_type: string | null }>;
};

export function WikiPanel({ roomId, onUploadInlineFile }: WikiPanelProps) {
  const wiki = useWikiArticles(roomId);

  return (
    <section className="wikiPanel">
      <WikiArticleList
        activeArticle={wiki.activeArticle}
        articles={wiki.articles}
        canCreate={Boolean(roomId)}
        saving={wiki.saving}
        onCreate={wiki.startCreate}
        onDelete={wiki.removeArticle}
        onSelect={wiki.selectArticle}
      />

      <main className="wikiArticleMain">
        {wiki.error ? <p className="wikiError">{wiki.error}</p> : null}
        {wiki.loading ? <p className="wikiEmpty">読み込み中...</p> : null}
        {!wiki.loading && wiki.articles.length === 0 && !wiki.isEditing ? (
          <WikiEmptyState canCreate={Boolean(roomId)} saving={wiki.saving} onCreate={wiki.startCreate} />
        ) : null}

        {wiki.isEditing ? (
          <WikiEditor
            bodyDraft={wiki.bodyDraft}
            creating={wiki.creating}
            saving={wiki.saving}
            titleDraft={wiki.titleDraft}
            setBodyDraft={wiki.setBodyDraft}
            setTitleDraft={wiki.setTitleDraft}
            onCancel={wiki.cancelEdit}
            onUploadInlineFile={onUploadInlineFile}
          />
        ) : wiki.activeArticle ? (
          <WikiArticleView article={wiki.activeArticle} />
        ) : null}
      </main>
    </section>
  );
}
