export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  text: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}