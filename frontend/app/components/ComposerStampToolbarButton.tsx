import { Stamp as StampIcon } from "lucide-react";

type ComposerStampToolbarButtonProps = {
  onOpen: () => void;
};

export function ComposerStampToolbarButton({ onOpen }: ComposerStampToolbarButtonProps) {
  return (
    <button
      type="button"
      className="markdownToolbarStampButton"
      title="スタンプ"
      aria-label="スタンプ"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onOpen}
    >
      <StampIcon size={15} />
    </button>
  );
}
