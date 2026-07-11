import type { Dispatch, SetStateAction } from "react";

import type { WikiArticle } from "../types";

export type WikiArticleMutationEditor = {
  bodyDraft: string;
  cancelEdit: () => void;
  creating: boolean;
  editingArticleId: string | null;
  markSavedArticle: (articleId: string) => void;
  startEdit: (article: WikiArticle) => void;
  titleDraft: string;
};

export type UseWikiArticleMutationsOptions = {
  activeArticleId: string | null;
  articles: WikiArticle[];
  editor: WikiArticleMutationEditor;
  roomId: string | null;
  saving: boolean;
  setActiveArticleId: Dispatch<SetStateAction<string | null>>;
  setArticles: Dispatch<SetStateAction<WikiArticle[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setSaving: Dispatch<SetStateAction<boolean>>;
};

export type UseWikiArticleSaveOptions = Pick<
  UseWikiArticleMutationsOptions,
  "editor" | "roomId" | "saving" | "setActiveArticleId" | "setArticles" | "setError" | "setSaving"
>;

export type UseWikiArticleRemovalOptions = Pick<
  UseWikiArticleMutationsOptions,
  "activeArticleId" | "articles" | "editor" | "saving" | "setActiveArticleId" | "setArticles" | "setError" | "setSaving"
>;
