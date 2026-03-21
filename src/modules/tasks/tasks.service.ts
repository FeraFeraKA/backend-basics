import { TaskStorage } from "./tasks.storage.js";
import type { Task, TaskStatus } from "./tasks.types.js";
import { HttpError } from "../../shared/errors/httpError.js";
import type { TasksListQuery } from "./tasks.schema.js";
import type { Prisma } from "@prisma/client";

export const TaskService = {
  async list(userId: string, query: TasksListQuery) {
    const { page, limit, status, search, sort, order } = query;

    const where: Prisma.TaskWhereInput = {
      userId,
      ...(status ? { status } : {}),
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const orderBy: Prisma.TaskOrderByWithRelationInput = {
      [sort]: order,
    };

    const items = await TaskStorage.list(where, skip, limit, orderBy);

    const total = await TaskStorage.count(where);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
