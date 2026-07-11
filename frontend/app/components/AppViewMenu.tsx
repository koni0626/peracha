import type { Dispatch, SetStateAction } from "react";

import type { ViewKind } from "./appViewTypes";
import { APP_VIEW_OPTIONS } from "./appViewOptions";

type AppViewMenuProps = {
  selectedKind: ViewKind;
  setSelectedKind: Dispatch<SetStateAction<ViewKind>>;
};

export function AppViewMenu({ selectedKind, setSelectedKind }: AppViewMenuProps) {
  return (
    <aside className="appViewMenu">
      {APP_VIEW_OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <button
            type="button"
            className={selectedKind === option.kind ? "active" : ""}
            key={option.kind}
            onClick={() => setSelectedKind(option.kind)}
          >
            <Icon size={16} />
            {option.label}
          </button>
        );
      })}
    </aside>
  );
}
