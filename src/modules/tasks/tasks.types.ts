import type {
  Task as PrismaTask,
  TaskStatus as PrismaStatus,
} from "@prisma/client";

export const TASK_STATUSES = ["TODO", "DOING", "DONE"] as const;

export const SORT_OPTIONS = ["createdAt", "updatedAt", "title"] as const;

export const ORDER_OPTIONS = ["asc", "desc"] as const;

export type TaskStatus = PrismaStatus;

export type Task = PrismaTask;
