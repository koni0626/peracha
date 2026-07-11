import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { WikiArticle } from "../types";
import { pickCurrentOrFirstId } from "./idListUtils";
import { getErrorMessage } from "./mutationRunner";
import { fetchRoomWikiArticles } from "./wikiApi";

type UseWikiArticleLoaderOptions = {
  roomId: string | null;
  setActiveArticleId: Dispatch<SetStateAction<string | null>>;
  setArticles: Dispatch<SetStateAction<WikiArticle[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useWikiArticleLoader({
  roomId,
  setActiveArticleId,
  setArticles,
  setError,
}: UseWikiArticleLoaderOptions) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roomId) {
      setArticles([]);
      setActiveArticleId(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetchRoomWikiArticles(roomId)
      .then((data) => {
        setArticles(data.items);
        setActiveArticleId((current) => pickCurrentOrFirstId(data.items, current));
      })
      .catch((err) => setError(getErrorMessage(err, "Wikiを読み込めませんでした")))
      .finally(() => setLoading(false));
  }, [roomId, setActiveArticleId, setArticles, setError]);

  return {
    loading,
  };
}
