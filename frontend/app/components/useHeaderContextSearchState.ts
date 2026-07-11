import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type UseHeaderContextSearchStateOptions = {
  contextQuery: string;
  contextResultCount: number;
  searchContexts: (event?: FormEvent<HTMLFormElement>) => void;
  setContextQuery: (value: string) => void;
};

export function useHeaderContextSearchState({
  contextQuery,
  contextResultCount,
  searchContexts,
  setContextQuery,
}: UseHeaderContextSearchStateOptions) {
  const [resultsOpen, setResultsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const hasQuery = contextQuery.trim().length > 0;
  const showResults = resultsOpen && hasQuery && contextResultCount > 0;

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Node && !searchRef.current?.contains(target)) {
        setResultsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setResultsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setContextQuery(value);
    setResultsOpen(value.trim().length > 0);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    searchContexts(event);
    setResultsOpen(contextQuery.trim().length > 0);
  }

  function handleFocus() {
    setResultsOpen(hasQuery && contextResultCount > 0);
  }

  return {
    handleFocus,
    handleQueryChange,
    handleSubmit,
    searchRef,
    showResults,
  };
}
