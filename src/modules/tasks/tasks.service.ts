import { TaskStorage } from "./tasks.storage.js";
import type { Task } from "./tasks.types.js";
import { HttpError } from "../../shared/errors/httpError.js";

export const TaskService = {
  list(): Task[] {
    return TaskStorage.list();
  },

  get(id: string): Task {
    const task = TaskStorage.get(id);

    if (!task) throw new HttpError(404, "NOT_FOUND", "Task not found");

    return task;
  },

  create(data: { title: string; text: string }): Task {
    const now = new Date().toISOString();

    const task: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      text: data.text,
      status: "todo",
      createdAt: now,
      updatedAt: now,
    };

    return TaskStorage.create(task);
  },

  update(id: string, patch: Partial<Task>) {
    const task = TaskStorage.update(id, patch);

    if (!task) throw new HttpError(404, "NOT_FOUND", "Task not found");

    return task;
  },

  remove(id: string) {
    const removed = TaskStorage.remove(id);

    if (!removed) throw new HttpError(404, "NOT_FOUND", "Task not found");
  },
};
