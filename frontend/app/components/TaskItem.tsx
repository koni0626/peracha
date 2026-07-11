import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Check } from "lucide-react";

import { TASK_STATUSES } from "../constants";
import type { Task } from "../types";

type TaskItemProps = {
  task: Task;
  taskNotes: Record<string, string>;
  setTaskNotes: Dispatch<SetStateAction<Record<string, string>>>;
  updateTask: (taskId: string, payload: Partial<Pick<Task, "status" | "progress_note">>) => void;
  saveTaskProgress: (event: FormEvent<HTMLFormElement>, taskId: string) => void;
};

export function TaskItem({ task, taskNotes, setTaskNotes, updateTask, saveTaskProgress }: TaskItemProps) {
  return (
    <div className="taskItem">
      <div>
        <strong>{task.title}</strong>
        <small>{task.assignee ?? "担当未定"}</small>
      </div>
      <select
        value={task.status}
        onChange={(event) => updateTask(task.id, { status: event.target.value })}
        aria-label={`${task.title}のステータス`}
      >
        {TASK_STATUSES.map((status) => (
          <option value={status} key={status}>
            {status}
          </option>
        ))}
      </select>
      {task.completion_condition ? <p>{task.completion_condition}</p> : null}
      <form className="taskProgressEditor" onSubmit={(event) => saveTaskProgress(event, task.id)}>
        <input
          name="progress_note"
          value={taskNotes[task.id] ?? task.progress_note ?? ""}
          onChange={(event) => setTaskNotes((current) => ({ ...current, [task.id]: event.target.value }))}
          placeholder="進捗メモ"
        />
        <button type="submit" title="進捗メモを保存">
          <Check size={15} />
        </button>
      </form>
    </div>
  );
}

export function TaskListEmpty() {
  return <p className="mutedText">外部エージェントへの作業依頼やAI整形結果からタスクを作成できます。</p>;
}
