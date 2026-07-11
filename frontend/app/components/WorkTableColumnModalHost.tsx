import type { WorkTableColumn, WorkTableFieldType } from "../types";
import { WorkTableColumnModal } from "./WorkTableColumnModal";
import { editColumnModalProps, newColumnModalProps } from "./workTableColumnModalProps";

type WorkTableColumnModalHostProps = {
  creatingColumnAt: number | null;
  editingColumn: WorkTableColumn | null;
  editingColumnName: string;
  editingColumnOptions: string;
  editingColumnType: WorkTableFieldType;
  newColumnName: string;
  newColumnOptions: string;
  newColumnType: WorkTableFieldType;
  saving: boolean;
  saveColumnEditor: () => void | Promise<void>;
  saveNewColumn: () => void | Promise<void>;
  setCreatingColumnAt: (position: number | null) => void;
  setEditingColumn: (column: WorkTableColumn | null) => void;
  setEditingColumnName: (name: string) => void;
  setEditingColumnOptions: (options: string) => void;
  setEditingColumnType: (type: WorkTableFieldType) => void;
  setNewColumnName: (name: string) => void;
  setNewColumnOptions: (options: string) => void;
  setNewColumnType: (type: WorkTableFieldType) => void;
};

export function WorkTableColumnModalHost({
  creatingColumnAt,
  editingColumn,
  editingColumnName,
  editingColumnOptions,
  editingColumnType,
  newColumnName,
  newColumnOptions,
  newColumnType,
  saving,
  saveColumnEditor,
  saveNewColumn,
  setCreatingColumnAt,
  setEditingColumn,
  setEditingColumnName,
  setEditingColumnOptions,
  setEditingColumnType,
  setNewColumnName,
  setNewColumnOptions,
  setNewColumnType,
}: WorkTableColumnModalHostProps) {
  return (
    <>
      {creatingColumnAt !== null ? (
        <WorkTableColumnModal
          {...newColumnModalProps({
            newColumnName,
            newColumnOptions,
            newColumnType,
            saving,
            saveNewColumn,
            setCreatingColumnAt,
            setNewColumnName,
            setNewColumnOptions,
            setNewColumnType,
          })}
        />
      ) : null}
      {editingColumn ? (
        <WorkTableColumnModal
          {...editColumnModalProps({
            editingColumnName,
            editingColumnOptions,
            editingColumnType,
            saving,
            saveColumnEditor,
            setEditingColumn,
            setEditingColumnName,
            setEditingColumnOptions,
            setEditingColumnType,
          })}
        />
      ) : null}
    </>
  );
}
