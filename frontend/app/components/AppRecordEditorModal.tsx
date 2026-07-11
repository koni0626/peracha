import type { Dispatch, SetStateAction } from "react";

import type { User, WorkTable, WorkTableColumn, WorkTableRecordValue } from "../types";
import { AppRecordFieldInput } from "./AppRecordFieldInput";
import { parseAppRecordDraftValue } from "./appRecordEditorUtils";
import { valueText } from "./appViewUtils";

type AppRecordEditorModalProps = {
  draftValues: Record<string, WorkTableRecordValue>;
  mode: "create" | "edit";
  saving: boolean;
  table: WorkTable;
  userOptions: User[];
  onClose: () => void;
  onSave: () => void | Promise<void>;
  setDraftValues: Dispatch<SetStateAction<Record<string, WorkTableRecordValue>>>;
};

export function AppRecordEditorModal({
  draftValues,
  mode,
  saving,
  table,
  userOptions,
  onClose,
  onSave,
  setDraftValues,
}: AppRecordEditorModalProps) {
  function updateValue(column: WorkTableColumn, nextValue: string) {
    setDraftValues((current) => ({ ...current, [column.id]: parseAppRecordDraftValue(column, nextValue) }));
  }

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="appRecordEditorTitle">
      <section className="appRecordEditorModal">
        <header>
          <div>
            <p>RECORD</p>
            <h2 id="appRecordEditorTitle">{mode === "create" ? "レコードを追加" : "レコードを編集"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="閉じる">×</button>
        </header>
        <div className="appRecordEditorFields">
          {table.columns.map((column) => (
            <label key={column.id}>
              {column.name}
              <AppRecordFieldInput
                column={column}
                userOptions={userOptions}
                value={valueText(draftValues[column.id])}
                onChange={(nextValue) => updateValue(column, nextValue)}
              />
            </label>
          ))}
        </div>
        <footer>
          <button type="button" onClick={onClose}>キャンセル</button>
          <button type="button" className="primary" disabled={saving} onClick={() => void onSave()}>
            保存
          </button>
        </footer>
      </section>
    </div>
  );
}
