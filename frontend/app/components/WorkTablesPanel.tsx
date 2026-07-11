import { useWorkTablesPanelController } from "../hooks/useWorkTablesPanelController";
import {
  WorkTablesPanelModals,
  WorkTablesPanelStatus,
  WorkTablesPanelWorkspace,
} from "./WorkTablesPanelSections";
import type { RoomMember } from "../types";

type WorkTablesPanelProps = {
  members: RoomMember[];
  roomId: string | null;
};

export function WorkTablesPanel({ members, roomId }: WorkTablesPanelProps) {
  const controller = useWorkTablesPanelController(roomId, members.map((member) => member.user));

  return (
    <section className="workTablesPanel">
      <WorkTablesPanelStatus controller={controller} roomId={roomId} />
      <WorkTablesPanelWorkspace controller={controller} roomId={roomId} />
      <WorkTablesPanelModals controller={controller} />
    </section>
  );
}
