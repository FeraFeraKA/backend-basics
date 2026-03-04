import type { Task } from "./tasks.types.js";

const tasks = new Map<string, Task>();

export const TaskStorage = {
  list(): Task[] {
    return Array.from(tasks.values());
  },

  get(id: string): Task | undefined {
    return tasks.get(id);
  },

  create(task: Task) {
    tasks.set(task.id, task);
    return task;
  },

  update(id: string, patch: Partial<Task>): Task | undefined {
    const existing = tasks.get(id);
    if (!existing) return undefined;

    const updated: Task = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    tasks.set(id, updated);
    return updated;
  },

  remove(id: string): boolean {
    return tasks.delete(id);
  },
};
