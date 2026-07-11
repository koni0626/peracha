import type { Dispatch, FormEvent, SetStateAction } from "react";

import type { Room, Task } from "../types";
import { ApiIntegrationSection } from "./ApiIntegrationSection";
import { HomeRoomOpsHeader } from "./HomeRoomOpsHeader";
import { TasksPanel } from "./TasksPanel";

type HomeRoomOpsProps = {
  rooms: Room[];
  homeRoomId: string | null;
  tasks: Task[];
  taskNotes: Record<string, string>;
  setError: (message: string | null) => void;
  setHomeRoomId: (roomId: string | null) => void;
  setTaskNotes: Dispatch<SetStateAction<Record<string, string>>>;
  onLoadTasks: (roomId?: string | null) => void | Promise<void>;
  onUpdateTask: (taskId: string, payload: Partial<Pick<Task, "status" | "progress_note">>) => void | Promise<void>;
  onSaveTaskProgress: (event: FormEvent<HTMLFormElement>, taskId: string) => void;
};

export function HomeRoomOps({
  rooms,
  homeRoomId,
  tasks,
  taskNotes,
  setError,
  setHomeRoomId,
  setTaskNotes,
  onLoadTasks,
  onUpdateTask,
  onSaveTaskProgress,
}: HomeRoomOpsProps) {
  const selectedHomeRoomId = homeRoomId ?? rooms[0]?.id ?? null;

  return (
    <section className="homeActionCard homeManagementCard">
      <HomeRoomOpsHeader rooms={rooms} selectedHomeRoomId={selectedHomeRoomId} setHomeRoomId={setHomeRoomId} />
      <div className="homeManagementGrid">
        <div className="homeEmbeddedPanel">
          <TasksPanel
            activeRoomId={selectedHomeRoomId}
            tasks={tasks}
            taskNotes={taskNotes}
            setTaskNotes={setTaskNotes}
            loadTasks={() => onLoadTasks(selectedHomeRoomId)}
            updateTask={onUpdateTask}
            saveTaskProgress={onSaveTaskProgress}
          />
        </div>
        <div className="homeEmbeddedPanel">
          <ApiIntegrationSection activeRoomId={selectedHomeRoomId} setError={setError} />
        </div>
      </div>
    </section>
  );
}
