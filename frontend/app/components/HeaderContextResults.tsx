import type { RelatedContext } from "../types";

export function HeaderContextResults({ results }: { results: RelatedContext[] }) {
  return (
    <div className="headerContextResults">
      {results.slice(0, 5).map((context) => (
        <div key={`${context.type}-${context.id}`}>
          <span>{context.title}</span>
          <small>{Math.round(context.confidence * 100)}%</small>
          <p>{context.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
