import { renderMarkdownBlocks } from "./markdownBlocks";

type MarkdownContentProps = {
  text: string;
};

export function MarkdownContent({ text }: MarkdownContentProps) {
  return <div className="markdownContent">{renderMarkdownBlocks(text)}</div>;
}
