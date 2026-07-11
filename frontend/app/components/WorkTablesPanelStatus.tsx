import { WorkTableWelcome } from "./WorkTableWelcome";
import type { WorkTablesPanelSectionProps } from "./workTablesPanelSectionTypes";

export function WorkTablesPanelStatus({ controller, roomId }: WorkTablesPanelSectionProps) {
  const { loading, state, tableActions } = controller;

  return (
    <>
      {state.error ? <p className="workTableError">{state.error}</p> : null}
      {loading ? <p className="workTableEmpty">読み込み中...</p> : null}
      {!loading && state.tables.length === 0 ? (
        <WorkTableWelcome
          creatingTable={state.creatingTable}
          roomId={roomId}
          saving={state.saving}
          tableName={state.tableName}
          addTable={tableActions.addTable}
          setCreatingTable={state.setCreatingTable}
          setTableName={state.setTableName}
        />
      ) : null}
    </>
  );
}
