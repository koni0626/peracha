import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { WorkTable, WorkTableRecord, WorkTableRecordValue } from "../types";
import { runSavingMutation } from "./mutationRunner";
import { replaceWorkTable } from "./workTableListUtils";
import { replaceTableRecord, updateTableRecords } from "./workTableRecordUtils";
import { createWorkTableRecord, createWorkTableRecordHistory, updateWorkTableRecord } from "./workTablesApi";

type UseAppRecordEditorOptions = {
  selectedTable: WorkTable | null;
  setError: Dispatch<SetStateAction<string | null>>;
  setTables: Dispatch<SetStateAction<WorkTable[]>>;
};

export function useAppRecordEditor({ selectedTable, setError, setTables }: UseAppRecordEditorOptions) {
  const [editingRecord, setEditingRecord] = useState<WorkTableRecord | null>(null);
  const [recordEditorOpen, setRecordEditorOpen] = useState(false);
  const [recordDraft, setRecordDraft] = useState<Record<string, WorkTableRecordValue>>({});
  const [savingRecord, setSavingRecord] = useState(false);

  function openRecordEditor(record: WorkTableRecord) {
    setEditingRecord(record);
    setRecordEditorOpen(true);
    setRecordDraft({ ...record.values });
    setError(null);
  }

  function openNewRecordEditor(initialValues: Record<string, WorkTableRecordValue> = {}) {
    setEditingRecord(null);
    setRecordEditorOpen(true);
    setRecordDraft(initialValues);
    setError(null);
  }

  function closeRecordEditor() {
    setRecordEditorOpen(false);
    setEditingRecord(null);
    setRecordDraft({});
  }

  async function saveRecordEditor() {
    if (!selectedTable || savingRecord) {
      return;
    }
    if (!editingRecord) {
      await runSavingMutation({ fallbackError: "レコードを追加できませんでした", setError, setSaving: setSavingRecord }, async () => {
        const created = await createWorkTableRecord(selectedTable.id, recordDraft);
        setTables((current) => updateTableRecords(current, selectedTable.id, (records) => [...records, created]));
        closeRecordEditor();
      });
      return;
    }
    if (JSON.stringify(editingRecord.values) === JSON.stringify(recordDraft)) {
      closeRecordEditor();
      return;
    }
    await runSavingMutation({ fallbackError: "レコードを保存できませんでした", setError, setSaving: setSavingRecord }, async () => {
      const tableWithHistory = await createWorkTableRecordHistory(selectedTable.id, editingRecord.id);
      const updated = await updateWorkTableRecord(selectedTable.id, editingRecord.id, recordDraft);
      const nextTable = replaceTableRecord(tableWithHistory, updated.id, updated);
      setTables((current) => replaceWorkTable(current, nextTable));
      closeRecordEditor();
    });
  }

  return {
    editingRecord,
    recordDraft,
    recordEditorOpen,
    savingRecord,
    closeRecordEditor,
    openNewRecordEditor,
    openRecordEditor,
    saveRecordEditor,
    setRecordDraft,
  };
}
