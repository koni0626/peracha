import { FileImage, ListChecks, Send, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ComposerAction } from "./ComposerControls";

export type ComposerTopActionItem = {
  disabled: boolean;
  icon: LucideIcon;
  key: string;
  label: string;
  title: string;
  type?: "button" | "submit";
  onClick?: () => void | Promise<void>;
};

type ComposerTopActionItemsOptions = {
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

export function composerTopActionItems({
  activeRoomId,
  blockingBusy,
  composerAction,
  draft,
  hasMessagePayload,
  proofreading,
  onClarifyDraft,
  onImproveDraft,
  onSendPeraichi,
}: ComposerTopActionItemsOptions): ComposerTopActionItem[] {
  const needsDraftDisabled = !activeRoomId || !draft.trim() || proofreading || blockingBusy;

  return [
    {
      key: "proofread",
      title: "誤字・脱字",
      disabled: needsDraftDisabled,
      icon: Sparkles,
      label: composerAction === "ai" ? "確認中" : "誤字・脱字",
      onClick: onImproveDraft,
    },
    {
      key: "clarify",
      title: "わかりやすく",
      disabled: needsDraftDisabled,
      icon: ListChecks,
      label: composerAction === "clarify" ? "整理中" : "わかりやすく",
      onClick: onClarifyDraft,
    },
    {
      key: "peraichi",
      title: "ペライチ",
      disabled: !activeRoomId || !draft.trim() || blockingBusy,
      icon: FileImage,
      label: composerAction === "peraichi" ? "作成中" : "ペライチ",
      onClick: onSendPeraichi,
    },
    {
      key: "send",
      type: "submit",
      title: "送信",
      disabled: !activeRoomId || !hasMessagePayload || blockingBusy,
      icon: Send,
      label: composerAction === "send" ? "送信中" : "送信",
    },
  ];
}
