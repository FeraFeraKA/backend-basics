import { TaskStorage } from "./tasks.storage.js";
import type { Task, TaskStatus } from "./tasks.types.js";
import { HttpError } from "../../shared/errors/httpError.js";

export const TaskService = {
  list(): Promise<Task[]> {
    return TaskStorage.list();
  },

  async get(id: string): Promise<Task> {
    const task = await TaskStorage.get(id);

    if (!task) throw new HttpError(404, "NOT_FOUND", "Task not found");

    return task;
  },

  create(data: {
    title: string;
    text: string;
    status: TaskStatus;
  }): Promise<Task> {
    return TaskStorage.create(data);
  },

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const task = await TaskStorage.update(id, data);

    if (!task) throw new HttpError(404, "NOT_FOUND", "Task not found");

    return task;
  },

  remove(id: string): Promise<Task> {
    return TaskStorage.remove(id);
  },
};
