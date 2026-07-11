import { useState } from "react";

import type { WorkTableColumn, WorkTableFieldType } from "../types";

export function useWorkTableColumnFormState() {
  const [creatingColumnAt, setCreatingColumnAt] = useState<number | null>(null);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState<WorkTableFieldType>("text");
  const [newColumnOptions, setNewColumnOptions] = useState("");
  const [editingColumn, setEditingColumn] = useState<WorkTableColumn | null>(null);
  const [editingColumnName, setEditingColumnName] = useState("");
  const [editingColumnType, setEditingColumnType] = useState<WorkTableFieldType>("text");
  const [editingColumnOptions, setEditingColumnOptions] = useState("");

  return {
    creatingColumnAt,
    editingColumn,
    editingColumnName,
    editingColumnOptions,
    editingColumnType,
    newColumnName,
    newColumnOptions,
    newColumnType,
    setCreatingColumnAt,
    setEditingColumn,
    setEditingColumnName,
    setEditingColumnOptions,
    setEditingColumnType,
    setNewColumnName,
    setNewColumnOptions,
    setNewColumnType,
  };
}
