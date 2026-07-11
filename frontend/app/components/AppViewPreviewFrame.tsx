import type { Dispatch, ReactNode, SetStateAction } from "react";

import type { WorkTable } from "../types";
import type { GanttScale, ViewKind } from "./appViewTypes";
import { appViewLabel } from "./appViewOptions";

type AppViewPreviewFrameProps = {
  children: ReactNode;
  ganttScale: GanttScale;
  selectedKind: ViewKind;
  selectedTable: WorkTable | null;
  setGanttScale: Dispatch<SetStateAction<GanttScale>>;
};

export function AppViewPreviewFrame({
  children,
  ganttScale,
  selectedKind,
  selectedTable,
  setGanttScale
}: AppViewPreviewFrameProps) {
  return (
    <section className="appViewPreview">
      <header>
        <div>
          <h2>{appViewLabel(selectedKind)}</h2>
          {selectedTable ? <span>{selectedTable.name}</span> : null}
        </div>
        {selectedKind === "gantt" ? (
          <div className="ganttModeSwitch" aria-label="ガントチャート表示単位">
            <button type="button" className={ganttScale === "day" ? "active" : ""} onClick={() => setGanttScale("day")}>
              日
            </button>
            <button type="button" className={ganttScale === "week" ? "active" : ""} onClick={() => setGanttScale("week")}>
              週
            </button>
            <button type="button" className={ganttScale === "month" ? "active" : ""} onClick={() => setGanttScale("month")}>
              月
            </button>
          </div>
        ) : null}
      </header>
      {children}
    </section>
  );
}
