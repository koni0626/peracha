import type { ReactNode } from "react";
import { Link2, Table2 } from "lucide-react";

import { commandButtons, type TableEditAction } from "./richMarkdownToolbarButtons";
import { RichMarkdownTableToolbarGroup } from "./RichMarkdownTableToolbarGroup";
import { RichMarkdownToolbarButton } from "./RichMarkdownToolbarButton";

export type { TableEditAction } from "./richMarkdownToolbarButtons";

type RichMarkdownToolbarProps = {
  onInsertLink: () => void;
  onInsertTable: () => void;
  onEditTable?: (action: TableEditAction) => void;
  onRunCommand: (command: string, commandValue?: string) => void;
  tableEditing?: boolean;
  toolbarExtra?: ReactNode;
};

export function RichMarkdownToolbar({
  onInsertLink,
  onInsertTable,
  onEditTable,
  onRunCommand,
  tableEditing = false,
  toolbarExtra,
}: RichMarkdownToolbarProps) {
  return (
    <div className="markdownToolbar" aria-label="Markdown tools">
      {commandButtons.map((button) => (
        <RichMarkdownToolbarButton
          key={`${button.command}-${button.commandValue ?? ""}`}
          title={button.title}
          onClick={() => onRunCommand(button.command, button.commandValue)}
        >
          {button.icon}
        </RichMarkdownToolbarButton>
      ))}
      <RichMarkdownToolbarButton title="リンク" onClick={onInsertLink}>
        <Link2 size={15} />
      </RichMarkdownToolbarButton>
      <RichMarkdownToolbarButton title="表" onClick={onInsertTable}>
        <Table2 size={15} />
      </RichMarkdownToolbarButton>
      {tableEditing ? <RichMarkdownTableToolbarGroup onEditTable={onEditTable} /> : null}
      {toolbarExtra}
    </div>
  );
}
