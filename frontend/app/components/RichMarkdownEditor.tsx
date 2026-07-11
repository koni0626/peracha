import { MentionSuggestions } from "./MentionSuggestions";
import type { RichMarkdownEditorProps } from "./richMarkdownEditorTypes";
import { RichEditorSurface } from "./RichEditorSurface";
import { RichMarkdownToolbar } from "./RichMarkdownToolbar";
import { useRichMarkdownEditorController } from "./useRichMarkdownEditorController";

export function RichMarkdownEditor(props: RichMarkdownEditorProps) {
  const { placeholder, surfaceAccessory, toolbarExtra } = props;
  const { mentionSuggestions, surface, toolbar } = useRichMarkdownEditorController(props);

  return (
    <div className="markdownComposer">
      <RichMarkdownToolbar {...toolbar} toolbarExtra={toolbarExtra} />
      <RichEditorSurface {...surface} placeholder={placeholder} surfaceAccessory={surfaceAccessory} />
      {mentionSuggestions.visible ? (
        <MentionSuggestions
          candidates={mentionSuggestions.candidates}
          highlightedIndex={mentionSuggestions.highlightedIndex}
          onSelect={mentionSuggestions.onSelect}
        />
      ) : null}
    </div>
  );
}
