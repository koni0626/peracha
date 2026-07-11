import { useEffect, useState } from "react";

import { RichMarkdownEditor } from "./RichMarkdownEditor";

type WorkTableMarkdownCellInputProps = {
  value: string;
  onDraftChange: (value: string) => void;
  onSave: (value: string) => void | Promise<void>;
};

function markdownPreview(value: string) {
  const compact = value
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "[画像]")
    .replace(/\s+/g, " ")
    .trim();
  if (!compact) {
    return "クリックしてMarkdownを入力";
  }
  return compact.length > 80 ? `${compact.slice(0, 80)}...` : compact;
}

export function WorkTableMarkdownCellInput({ value, onDraftChange, onSave }: WorkTableMarkdownCellInputProps) {
  const [draft, setDraft] = useState(value);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setDraft(value);
    }
  }, [open, value]);

  async function save() {
    if (saving) {
      return;
    }
    setSaving(true);
    try {
      onDraftChange(draft);
      await onSave(draft);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button type="button" className="workTableMarkdownCellButton" onClick={() => setOpen(true)}>
        {markdownPreview(value)}
      </button>
      {open ? (
        <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="workTableMarkdownEditorTitle">
          <section className="workTableMarkdownEditorModal">
            <header>
              <div>
                <p>MARKDOWN</p>
                <h2 id="workTableMarkdownEditorTitle">Markdownを編集</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="閉じる">
                ×
              </button>
            </header>
            <div className="workTableMarkdownEditorBody">
              <RichMarkdownEditor value={draft} onChange={setDraft} placeholder="Markdownで入力" />
            </div>
            <footer>
              <button type="button" onClick={() => setOpen(false)}>
                キャンセル
              </button>
              <button type="button" className="primary" disabled={saving} onClick={() => void save()}>
                保存
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
