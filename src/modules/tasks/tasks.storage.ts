import type { Task, TaskStatus } from "./tasks.types.js";
import { prisma } from "../../shared/db/prisma.js";

export const TaskStorage = {
  async list(): Promise<Task[]> {
    return prisma.task.findMany();
  },

  async get(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
    });
  },

  async create(data: {
    title: string;
    text: string;
    status: TaskStatus;
  }): Promise<Task> {
    return prisma.task.create({
      data,
    });
  },

  async update(id: string, data: Partial<Task>): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
    });
  },

  async remove(id: string): Promise<Task> {
    return prisma.task.delete({
      where: { id },
    });
  },
};
