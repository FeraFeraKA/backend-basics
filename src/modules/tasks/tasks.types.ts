export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "done",
] as const;

export type TaskStatus = typeof TASK_STATUSES[number];

export interface Task {
  id: string;
  title: string;
  text: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}