import { Dock, Maximize2, Minimize2, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import type { Message } from "../types";

export type ComposerAction = "ai" | "clarify" | "peraichi" | "send" | null;
export type ComposerMode = "docked" | "floating";

type ComposerModeBarProps = {
  composerMode: ComposerMode;
  setComposerMode: Dispatch<SetStateAction<ComposerMode>>;
};

export function ComposerModeBar({ composerMode, setComposerMode }: ComposerModeBarProps) {
  return (
    <div className="composerModeSwitch" aria-label="入力欄の表示方法">
      <button
        type="button"
        className={composerMode === "docked" ? "active" : ""}
        title="ドッキング"
        onClick={() => setComposerMode("docked")}
      >
        <Dock size={15} />
      </button>
      <button
        type="button"
        className={composerMode === "floating" ? "active" : ""}
        title="フローティング"
        onClick={() => setComposerMode("floating")}
      >
        <Maximize2 size={15} />
      </button>
    </div>
  );
}

type ComposerCompactButtonProps = {
  composerMode: ComposerMode;
  setComposerMode: Dispatch<SetStateAction<ComposerMode>>;
};

export function ComposerCompactButton({ composerMode, setComposerMode }: ComposerCompactButtonProps) {
  if (composerMode !== "floating") {
    return null;
  }

  return (
    <button type="button" className="composerCompactButton" title="ドッキングに戻す" onClick={() => setComposerMode("docked")}>
      <Minimize2 size={15} />
    </button>
  );
}

type ComposerReplyBarProps = {
  replyTo: Message | null;
  onCancelReply: () => void;
};

export function ComposerReplyBar({ replyTo, onCancelReply }: ComposerReplyBarProps) {
  if (!replyTo) {
    return null;
  }

  return (
    <div className="composerReplyBar">
      <div>
        <strong>返信先: {replyTo.sender_name ?? replyTo.sender_type}</strong>
        <span>{replyTo.body.trim() || "添付メッセージ"}</span>
      </div>
      <button type="button" title="返信を取り消す" onClick={onCancelReply}>
        <X size={15} />
      </button>
    </div>
  );
}
