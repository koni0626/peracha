import type { MouseEvent, ReactNode } from "react";

type RichMarkdownToolbarButtonProps = {
  children: ReactNode;
  className?: string;
  title: string;
  onClick: () => void | Promise<void>;
};

export function keepToolbarSelection(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

export function RichMarkdownToolbarButton({
  children,
  className,
  title,
  onClick,
}: RichMarkdownToolbarButtonProps) {
  return (
    <button type="button" className={className} title={title} onMouseDown={keepToolbarSelection} onClick={onClick}>
      {children}
    </button>
  );
}
