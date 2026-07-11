import type { Dispatch, SetStateAction } from "react";

import { RichMarkdownEditor } from "./RichMarkdownEditor";

type WikiEditorProps = {
  bodyDraft: string;
  creating: boolean;
  saving: boolean;
  titleDraft: string;
  setBodyDraft: Dispatch<SetStateAction<string>>;
  setTitleDraft: Dispatch<SetStateAction<string>>;
  onCancel: () => void;
  onUploadInlineFile: (file: File) => Promise<{ title: string; url: string; content_type: string | null }>;
};

export function WikiEditor({
  bodyDraft,
  creating,
  saving,
  titleDraft,
  setBodyDraft,
  setTitleDraft,
  onCancel,
  onUploadInlineFile,
}: WikiEditorProps) {
  return (
    <div className="wikiEditor">
      <input
        className="wikiTitleInput"
        value={titleDraft}
        onChange={(event) => setTitleDraft(event.target.value)}
        placeholder="タイトル"
        autoFocus
      />
      <RichMarkdownEditor
        value={bodyDraft}
        onChange={setBodyDraft}
        onUploadInlineFile={onUploadInlineFile}
        preferSavedSelectionOnImageDrop
        placeholder="本文を書いてください"
      />
      <div className="wikiEditorActions">
        {creating ? (
          <button type="button" onClick={onCancel}>
            キャンセル
          </button>
        ) : null}
        <span className="wikiAutoSaveStatus">{saving ? "自動保存中..." : "自動保存"}</span>
      </div>
    </div>
  );
}
