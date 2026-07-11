import { WorkTableGrid } from "./WorkTableGrid";
import type { WorkTableGridProps } from "./workTableGridTypes";
import { WorkTableSidebar } from "./WorkTableSidebar";
import type { WorkTableSidebarProps } from "./WorkTableSidebar";

export type WorkTableWorkspaceProps = WorkTableSidebarProps & WorkTableGridProps;

export function WorkTableWorkspace(props: WorkTableWorkspaceProps) {
  return (
    <div className="workTableWorkspace">
      <WorkTableSidebar {...props} />
      <WorkTableGrid {...props} />
    </div>
  );
}
