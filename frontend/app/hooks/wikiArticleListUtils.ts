import type { WikiArticle } from "../types";
import { prependUniqueById, removeById, replaceById } from "./idListUtils";

export function prependWikiArticle(articles: WikiArticle[], article: WikiArticle) {
  return prependUniqueById(articles, article, articles.length + 1);
}

export function replaceWikiArticle(articles: WikiArticle[], article: WikiArticle) {
  return replaceById(articles, article);
}

export function removeWikiArticle(articles: WikiArticle[], articleId: string) {
  return removeById(articles, articleId);
}

export function activeWikiArticle(articles: WikiArticle[], activeArticleId: string | null) {
  return articles.find((article) => article.id === activeArticleId) ?? articles[0] ?? null;
}

export function nextActiveWikiArticleId(
  currentActiveArticleId: string | null,
  removedArticleId: string,
  remainingArticles: WikiArticle[],
) {
  return currentActiveArticleId === removedArticleId ? remainingArticles[0]?.id ?? null : currentActiveArticleId;
}
