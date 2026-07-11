import type { WorkTablesPanelController } from "../hooks/useWorkTablesPanelController";

export type WorkTablesPanelSectionProps = {
  controller: WorkTablesPanelController;
  roomId: string | null;
};
