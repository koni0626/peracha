import type { WorkTableColumn, WorkTableFieldType } from "../types";
import type { WorkTableColumnModalProps } from "./WorkTableColumnModal";

type NewColumnModalPropsOptions = {
  newColumnName: string;
  newColumnOptions: string;
  newColumnType: WorkTableFieldType;
  saving: boolean;
  saveNewColumn: () => void | Promise<void>;
  setCreatingColumnAt: (position: number | null) => void;
  setNewColumnName: (name: string) => void;
  setNewColumnOptions: (options: string) => void;
  setNewColumnType: (type: WorkTableFieldType) => void;
};

type EditColumnModalPropsOptions = {
  editingColumnName: string;
  editingColumnOptions: string;
  editingColumnType: WorkTableFieldType;
  saving: boolean;
  saveColumnEditor: () => void | Promise<void>;
  setEditingColumn: (column: WorkTableColumn | null) => void;
  setEditingColumnName: (name: string) => void;
  setEditingColumnOptions: (options: string) => void;
  setEditingColumnType: (type: WorkTableFieldType) => void;
};

export function newColumnModalProps({
  newColumnName,
  newColumnOptions,
  newColumnType,
  saving,
  saveNewColumn,
  setCreatingColumnAt,
  setNewColumnName,
  setNewColumnOptions,
  setNewColumnType,
}: NewColumnModalPropsOptions): WorkTableColumnModalProps {
  return {
    columnName: newColumnName,
    columnOptions: newColumnOptions,
    columnType: newColumnType,
    saving,
    submitLabel: "追加",
    title: "列を追加",
    onClose: () => setCreatingColumnAt(null),
    onSubmit: saveNewColumn,
    setColumnName: setNewColumnName,
    setColumnOptions: setNewColumnOptions,
    setColumnType: setNewColumnType,
  };
}

export function editColumnModalProps({
  editingColumnName,
  editingColumnOptions,
  editingColumnType,
  saving,
  saveColumnEditor,
  setEditingColumn,
  setEditingColumnName,
  setEditingColumnOptions,
  setEditingColumnType,
}: EditColumnModalPropsOptions): WorkTableColumnModalProps {
  return {
    columnName: editingColumnName,
    columnOptions: editingColumnOptions,
    columnType: editingColumnType,
    saving,
    submitLabel: "保存",
    title: "列の編集",
    onClose: () => setEditingColumn(null),
    onSubmit: saveColumnEditor,
    setColumnName: setEditingColumnName,
    setColumnOptions: setEditingColumnOptions,
    setColumnType: setEditingColumnType,
  };
}
