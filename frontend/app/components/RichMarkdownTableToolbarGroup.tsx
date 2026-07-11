import type { TableEditAction } from "./richMarkdownToolbarButtons";
import { tableButtons } from "./richMarkdownToolbarButtons";
import { RichMarkdownToolbarButton } from "./RichMarkdownToolbarButton";

type RichMarkdownTableToolbarGroupProps = {
  onEditTable?: (action: TableEditAction) => void;
};

export function RichMarkdownTableToolbarGroup({ onEditTable }: RichMarkdownTableToolbarGroupProps) {
  return (
    <span className="markdownToolbarGroup" aria-label="表の編集">
      {tableButtons.map((button) => (
        <RichMarkdownToolbarButton
          key={button.action}
          className={button.danger ? "dangerToolbarButton" : undefined}
          title={button.title}
          onClick={() => onEditTable?.(button.action)}
        >
          {button.icon}
        </RichMarkdownToolbarButton>
      ))}
    </span>
  );
}
