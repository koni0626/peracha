"use client";

import type { FormEvent } from "react";
import { Search } from "lucide-react";
import type { RelatedContext } from "../types";
import { HeaderContextResults } from "./HeaderContextResults";
import { useHeaderContextSearchState } from "./useHeaderContextSearchState";

type HeaderContextSearchProps = {
  activeRoomId: string | null;
  contextQuery: string;
  contextResults: RelatedContext[];
  contextLoading: boolean;
  setContextQuery: (value: string) => void;
  searchContexts: (event?: FormEvent<HTMLFormElement>) => void;
};

export function HeaderContextSearch({
  activeRoomId,
  contextQuery,
  contextResults,
  contextLoading,
  setContextQuery,
  searchContexts,
}: HeaderContextSearchProps) {
  const { handleFocus, handleQueryChange, handleSubmit, searchRef, showResults } = useHeaderContextSearchState({
    contextQuery,
    contextResultCount: contextResults.length,
    searchContexts,
    setContextQuery,
  });

  return (
    <div className="headerContextSearch" ref={searchRef}>
      <form className="headerContextSearchForm" onSubmit={handleSubmit}>
        <input
          value={contextQuery}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          placeholder="文脈検索"
          aria-label="文脈検索"
        />
        <button type="submit" disabled={!activeRoomId || contextLoading} title="検索">
          <Search size={16} />
        </button>
      </form>
      {showResults ? <HeaderContextResults results={contextResults} /> : null}
    </div>
  );
}
