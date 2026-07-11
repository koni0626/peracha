import type { WikiArticle } from "../types";
import { MarkdownContent } from "./MarkdownContent";

type WikiArticleViewProps = {
  article: WikiArticle;
};

export function WikiArticleView({ article }: WikiArticleViewProps) {
  return (
    <article className="wikiArticleView">
      <h2>{article.title}</h2>
      {article.body_markdown ? (
        <MarkdownContent text={article.body_markdown} />
      ) : (
        <p className="wikiEmpty">本文がありません。</p>
      )}
    </article>
  );
}
