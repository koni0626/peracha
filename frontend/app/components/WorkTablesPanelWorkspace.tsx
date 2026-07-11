import { WorkTableWorkspace } from "./WorkTableWorkspace";
import { selectWorkTableWorkspaceProps } from "./workTableWorkspaceProps";
import type { WorkTablesPanelSectionProps } from "./workTablesPanelSectionTypes";

export function WorkTablesPanelWorkspace({ controller, roomId }: WorkTablesPanelSectionProps) {
  const workspaceProps = selectWorkTableWorkspaceProps(controller, roomId);

  if (!workspaceProps) {
    return null;
  }

  return <WorkTableWorkspace {...workspaceProps} />;
}
