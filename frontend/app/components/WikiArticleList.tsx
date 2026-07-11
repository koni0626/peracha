import { FileText, Plus, Trash2 } from "lucide-react";

import type { WikiArticle } from "../types";

type WikiArticleListProps = {
  activeArticle: WikiArticle | null;
  articles: WikiArticle[];
  canCreate: boolean;
  saving: boolean;
  onCreate: () => void;
  onDelete: (article: WikiArticle) => void | Promise<void>;
  onSelect: (articleId: string) => void;
};

export function WikiArticleList({
  activeArticle,
  articles,
  canCreate,
  saving,
  onCreate,
  onDelete,
  onSelect,
}: WikiArticleListProps) {
  return (
    <aside className="wikiArticleList">
      {articles.map((article) => (
        <div className={`wikiArticleListItem ${article.id === activeArticle?.id ? "active" : ""}`} key={article.id}>
          <button type="button" className="wikiArticleSelect" onClick={() => onSelect(article.id)}>
            <FileText size={15} />
            <span>{article.title}</span>
          </button>
          <button
            type="button"
            className="wikiArticleIconButton danger"
            title="記事を削除"
            onClick={() => void onDelete(article)}
            disabled={saving}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" className="wikiAddButton" onClick={onCreate} disabled={!canCreate || saving}>
        <Plus size={16} />
      </button>
    </aside>
  );
}
