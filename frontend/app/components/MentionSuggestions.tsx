import { apiUrl } from "../api";
import type { User } from "../types";

type MentionSuggestionsProps = {
  candidates: User[];
  highlightedIndex: number;
  onSelect: (user: User) => void;
};

export function MentionSuggestions({ candidates, highlightedIndex, onSelect }: MentionSuggestionsProps) {
  return (
    <div className="mentionSuggestions" role="listbox" aria-label="メンション候補">
      {candidates.length > 0 ? (
        candidates.map((user, index) => (
          <button
            key={user.id}
            type="button"
            className={index === highlightedIndex ? "active" : ""}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(user)}
            role="option"
            aria-selected={index === highlightedIndex}
          >
            <span className="mentionSuggestionAvatar">
              {user.avatar_url ? <img src={apiUrl(user.avatar_url)} alt="" /> : user.name.slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
          </button>
        ))
      ) : (
        <p>候補がありません</p>
      )}
    </div>
  );
}
