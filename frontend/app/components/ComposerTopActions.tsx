import type { LucideIcon } from "lucide-react";

import type { ComposerAction } from "./ComposerControls";
import { composerTopActionItems } from "./composerTopActionItems";

type ComposerTopActionsProps = {
  activeRoomId: string | null;
  blockingBusy: boolean;
  composerAction: ComposerAction;
  draft: string;
  hasMessagePayload: boolean;
  proofreading: boolean;
  onClarifyDraft: () => void | Promise<void>;
  onImproveDraft: () => void | Promise<void>;
  onSendPeraichi: () => void | Promise<void>;
};

type ComposerActionButtonProps = {
  disabled: boolean;
  icon: LucideIcon;
  label: string;
  title: string;
  type?: "button" | "submit";
  onClick?: () => void | Promise<void>;
};

function ComposerActionButton({
  disabled,
  icon: Icon,
  label,
  title,
  type = "button",
  onClick,
}: ComposerActionButtonProps) {
  return (
    <button type={type} className="composerTextButton" title={title} disabled={disabled} onClick={onClick}>
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

export function ComposerTopActions({
  activeRoomId,
  blockingBusy,
  composerAction,
  draft,
  hasMessagePayload,
  proofreading,
  onClarifyDraft,
  onImproveDraft,
  onSendPeraichi,
}: ComposerTopActionsProps) {
  const items = composerTopActionItems({
    activeRoomId,
    blockingBusy,
    composerAction,
    draft,
    hasMessagePayload,
    proofreading,
    onClarifyDraft,
    onImproveDraft,
    onSendPeraichi,
  });

  return (
    <div className="composerTopActions">
      {items.map((item) => (
        <ComposerActionButton
          key={item.key}
          type={item.type}
          title={item.title}
          disabled={item.disabled}
          icon={item.icon}
          label={item.label}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
}
