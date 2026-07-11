export type ComposerAction = "ai" | "clarify" | "peraichi" | "send" | null;

type ResolveComposerActionOptions = {
  clarifying: boolean;
  creatingPeraichi: boolean;
  proofreading: boolean;
  sending: boolean;
};

export function resolveComposerAction({
  clarifying,
  creatingPeraichi,
  proofreading,
  sending,
}: ResolveComposerActionOptions): ComposerAction {
  if (sending) {
    return "send";
  }
  if (creatingPeraichi) {
    return "peraichi";
  }
  if (clarifying) {
    return "clarify";
  }
  if (proofreading) {
    return "ai";
  }
  return null;
}
