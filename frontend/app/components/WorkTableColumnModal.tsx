import type { WorkTableFieldType } from "../types";
import { WORK_TABLE_FIELD_TYPES } from "./WorkTableFieldTypeIcon";

export type WorkTableColumnModalProps = {
  columnName: string;
  columnOptions: string;
  columnType: WorkTableFieldType;
  saving: boolean;
  submitLabel: string;
  title: string;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  setColumnName: (value: string) => void;
  setColumnOptions: (value: string) => void;
  setColumnType: (value: WorkTableFieldType) => void;
};

export function WorkTableColumnModal({
  columnName,
  columnOptions,
  columnType,
  saving,
  submitLabel,
  title,
  onClose,
  onSubmit,
  setColumnName,
  setColumnOptions,
  setColumnType,
}: WorkTableColumnModalProps) {
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="workTableColumnModalTitle">
      <section className="columnEditorModal">
        <header>
          <div>
            <p>COLUMN</p>
            <h2 id="workTableColumnModalTitle">{title}</h2>
          </div>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </header>
        <label>
          列名
          <input value={columnName} onChange={(event) => setColumnName(event.target.value)} autoFocus />
        </label>
        <label>
          型
          <select value={columnType} onChange={(event) => setColumnType(event.target.value as WorkTableFieldType)}>
            {WORK_TABLE_FIELD_TYPES.map((type) => (
              <option value={type.value} key={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        {columnType === "select" ? (
          <label>
            選択肢
            <textarea
              value={columnOptions}
              onChange={(event) => setColumnOptions(event.target.value)}
              rows={3}
              placeholder="未着手, 進行中, 完了"
            />
            <small>カンマ区切りで入力してください。</small>
          </label>
        ) : null}
        <footer>
          <button type="button" onClick={onClose}>
            キャンセル
          </button>
          <button type="button" className="primary" disabled={saving || !columnName.trim()} onClick={() => void onSubmit()}>
            {submitLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}
