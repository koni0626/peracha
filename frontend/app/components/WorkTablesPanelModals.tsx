import type { WorkTablesPanelController } from "../hooks/useWorkTablesPanelController";
import { WorkTableColumnModalHost } from "./WorkTableColumnModalHost";
import { WorkTableFolderModalHost } from "./WorkTableFolderModalHost";

export function WorkTablesPanelModals({ controller }: { controller: WorkTablesPanelController }) {
  const { activeTable, columnActions, recordActions, state } = controller;
  const { columnForm, folderState } = state;

  return (
    <>
      <WorkTableFolderModalHost
        activeTable={activeTable}
        folderModal={folderState.folderModal}
        folderPreviewError={folderState.folderPreviewError}
        folderSelectedFileId={folderState.folderSelectedFileId}
        onClose={() => folderState.setFolderModal(null)}
        onUploadFiles={recordActions.uploadFolderFiles}
        setFolderPreviewError={folderState.setFolderPreviewError}
        setFolderSelectedFileId={folderState.setFolderSelectedFileId}
      />
      <WorkTableColumnModalHost
        creatingColumnAt={columnForm.creatingColumnAt}
        editingColumn={columnForm.editingColumn}
        editingColumnName={columnForm.editingColumnName}
        editingColumnOptions={columnForm.editingColumnOptions}
        editingColumnType={columnForm.editingColumnType}
        newColumnName={columnForm.newColumnName}
        newColumnOptions={columnForm.newColumnOptions}
        newColumnType={columnForm.newColumnType}
        saving={state.saving}
        saveColumnEditor={columnActions.saveColumnEditor}
        saveNewColumn={columnActions.saveNewColumn}
        setCreatingColumnAt={columnForm.setCreatingColumnAt}
        setEditingColumn={columnForm.setEditingColumn}
        setEditingColumnName={columnForm.setEditingColumnName}
        setEditingColumnOptions={columnForm.setEditingColumnOptions}
        setEditingColumnType={columnForm.setEditingColumnType}
        setNewColumnName={columnForm.setNewColumnName}
        setNewColumnOptions={columnForm.setNewColumnOptions}
        setNewColumnType={columnForm.setNewColumnType}
      />
    </>
  );
}
