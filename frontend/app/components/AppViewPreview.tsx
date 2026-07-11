import type { AppViewsState } from "../hooks/useAppViews";
import { AppCalendarView } from "./AppCalendarView";
import { AppGanttView } from "./AppGanttView";
import { AppKanbanView } from "./AppKanbanView";

type AppViewPreviewProps = {
  app: AppViewsState;
};

export function AppViewPreview({ app }: AppViewPreviewProps) {
  if (!app.selectedTable) {
    return <p className="appViewEmpty">テーブルを作成してください。</p>;
  }

  if (app.selectedKind === "kanban") {
    return (
      <AppKanbanView
        draggedRecordId={app.draggedKanbanRecordId}
        dragOverStatus={app.dragOverKanbanStatus}
        records={app.records}
        statusColumn={app.statusColumn}
        moveRecord={app.moveKanbanRecord}
        onOpenRecord={app.openRecordEditor}
        recordTitle={app.recordTitle}
        setDraggedRecordId={app.setDraggedKanbanRecordId}
        setDragOverStatus={app.setDragOverKanbanStatus}
      />
    );
  }

  if (app.selectedKind === "calendar") {
    return (
      <AppCalendarView
        calendarMonth={app.calendarMonth}
        endDateColumn={app.endDateColumn}
        onCreateRecord={app.openNewRecordEditor}
        onOpenRecord={app.openRecordEditor}
        records={app.records}
        recordTitle={app.recordTitle}
        setCalendarMonth={app.setCalendarMonth}
        startDateColumn={app.startDateColumn}
      />
    );
  }

  return (
    <AppGanttView
      endDateColumn={app.endDateColumn}
      ganttScale={app.ganttScale}
      progressColumn={app.progressColumn}
      records={app.records}
      startDateColumn={app.startDateColumn}
      onOpenRecord={app.openRecordEditor}
      onUpdateProgress={app.updateGanttProgress}
      recordTitle={app.recordTitle}
    />
  );
}
