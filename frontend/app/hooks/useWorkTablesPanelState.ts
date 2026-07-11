import { useState } from "react";

import type { WorkTable } from "../types";
import { useWorkTableColumnFormState } from "./useWorkTableColumnFormState";
import { useWorkTableDragState } from "./useWorkTableDragState";
import { useWorkTableFolderModalState } from "./useWorkTableFolderModalState";
import { useWorkTableGridUiState } from "./useWorkTableGridUiState";
import { buildWorkTablesPanelState } from "./workTablesPanelStateBuilder";

export function useWorkTablesPanelState() {
  const [tables, setTables] = useState<WorkTable[]>([]);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [creatingTable, setCreatingTable] = useState(false);
  const [tableName, setTableName] = useState("");
  const gridUiState = useWorkTableGridUiState();
  const dragState = useWorkTableDragState();
  const columnForm = useWorkTableColumnFormState();
  const folderState = useWorkTableFolderModalState();
  const [error, setError] = useState<string | null>(null);

  return buildWorkTablesPanelState({
    activeTableId,
    columnForm,
    creatingTable,
    dragState,
    error,
    folderState,
    gridUiState,
    saving,
    tableName,
    tables,
    setActiveTableId,
    setCreatingTable,
    setError,
    setSaving,
    setTableName,
    setTables,
  });
}
