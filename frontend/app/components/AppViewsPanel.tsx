import { useAppViews } from "../hooks/useAppViews";
import { AppRecordEditorModal } from "./AppRecordEditorModal";
import { AppViewConfigPanel } from "./AppViewConfigPanel";
import { AppViewMenu } from "./AppViewMenu";
import { AppViewPreview } from "./AppViewPreview";
import { AppViewPreviewFrame } from "./AppViewPreviewFrame";
import type { RoomMember } from "../types";

type AppViewsPanelProps = {
  members: RoomMember[];
  roomId: string | null;
};

export function AppViewsPanel({ members, roomId }: AppViewsPanelProps) {
  const app = useAppViews(roomId);
  const userOptions = members.map((member) => member.user);

  return (
    <section className="appViewsPanel">
      <AppViewMenu selectedKind={app.selectedKind} setSelectedKind={app.setSelectedKind} />

      <main className="appViewMain">
        {app.error ? <p className="appViewError">{app.error}</p> : null}
        {app.loading ? <p className="appViewEmpty">読み込み中...</p> : null}
        <AppViewConfigPanel
          dateColumns={app.dateColumns}
          endDateColumn={app.endDateColumn}
          progressColumn={app.progressColumn}
          progressColumns={app.progressColumns}
          selectColumns={app.selectColumns}
          selectedTable={app.selectedTable}
          startDateColumn={app.startDateColumn}
          statusColumn={app.statusColumn}
          tables={app.tables}
          textColumns={app.textColumns}
          titleColumn={app.titleColumn}
          setEndDateColumnId={app.setEndDateColumnId}
          setProgressColumnId={app.setProgressColumnId}
          setSelectedTableId={app.setSelectedTableId}
          setStartDateColumnId={app.setStartDateColumnId}
          setStatusColumnId={app.setStatusColumnId}
          setTitleColumnId={app.setTitleColumnId}
        />

        <AppViewPreviewFrame
          ganttScale={app.ganttScale}
          selectedKind={app.selectedKind}
          selectedTable={app.selectedTable}
          setGanttScale={app.setGanttScale}
        >
          <AppViewPreview app={app} />
        </AppViewPreviewFrame>
      </main>

      {app.recordEditorOpen && app.selectedTable ? (
        <AppRecordEditorModal
          draftValues={app.recordDraft}
          mode={app.editingRecord ? "edit" : "create"}
          saving={app.savingRecord}
          table={app.selectedTable}
          userOptions={userOptions}
          onClose={app.closeRecordEditor}
          onSave={app.saveRecordEditor}
          setDraftValues={app.setRecordDraft}
        />
      ) : null}
    </section>
  );
}
