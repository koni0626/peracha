"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { ListTodo } from "lucide-react";
import type { Task } from "../types";
import { TaskItem, TaskListEmpty } from "./TaskItem";

type TasksPanelProps = {
  activeRoomId: string | null;
  tasks: Task[];
  taskNotes: Record<string, string>;
  setTaskNotes: Dispatch<SetStateAction<Record<string, string>>>;
  loadTasks: () => void;
  updateTask: (taskId: string, payload: Partial<Pick<Task, "status" | "progress_note">>) => void;
  saveTaskProgress: (event: FormEvent<HTMLFormElement>, taskId: string) => void;
};

export function TasksPanel({
  activeRoomId,
  tasks,
  taskNotes,
  setTaskNotes,
  loadTasks,
  updateTask,
  saveTaskProgress
}: TasksPanelProps) {
  return (
    <section>
      <p className="eyebrow">Tasks</p>
      <div className="sectionTitleRow">
        <h2>タスク</h2>
        <button type="button" onClick={loadTasks} disabled={!activeRoomId} title="タスク取得">
          <ListTodo size={16} />
        </button>
      </div>
      {tasks.length > 0 ? (
        <div className="taskList">
          {tasks.slice(0, 6).map((task) => (
            <TaskItem
              key={task.id}
              saveTaskProgress={saveTaskProgress}
              setTaskNotes={setTaskNotes}
              task={task}
              taskNotes={taskNotes}
              updateTask={updateTask}
            />
          ))}
        </div>
      ) : (
        <TaskListEmpty />
      )}
    </section>
  );
}
