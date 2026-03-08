import { TaskStorage } from "./tasks.storage.js";
import type { Task, TaskStatus } from "./tasks.types.js";
import { HttpError } from "../../shared/errors/httpError.js";

export const TaskService = {
  list(userId: string): Promise<Task[]> {
    return TaskStorage.list(userId);
  },

  async get(id: string, userId: string): Promise<Task> {
    const task = await TaskStorage.findById(id, userId);

    if (!task) throw new HttpError(404, "NOT_FOUND", "Task not found");

    return task;
  },

  create(data: {
    title: string;
    text: string;
    status: TaskStatus;
    userId: string;
  }): Promise<Task> {
    return TaskStorage.create(data);
  },

  async update(id: string, userId: string, data: Partial<Task>): Promise<Task> {
    const task = await TaskStorage.findById(id, userId);

    if (!task) throw new HttpError(404, "NOT_FOUND", "Task not found");

    return TaskStorage.update(id, data);
  },

  async remove(id: string, userId: string): Promise<Task> {
    const task = await TaskStorage.findById(id, userId);

    if (!task) throw new HttpError(404, "NOT_FOUND", "Task not found");

    return TaskStorage.remove(id);
  },
};
