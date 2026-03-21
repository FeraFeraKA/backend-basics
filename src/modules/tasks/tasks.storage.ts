import type { Task, TaskStatus } from "./tasks.types.js";
import { prisma } from "../../shared/db/prisma.js";

export const TaskStorage = {
  async list(where: object, skip: number, take: number, orderBy: object) {
    return prisma.task.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  },

  async count(where: object) {
    return prisma.task.count({
      where,
    });
  },

  async findById(id: string, userId: string): Promise<Task | null> {
    return prisma.task.findFirst({
      where: { id, userId },
    });
  },

  async create(data: {
    title: string;
    text: string;
    status: TaskStatus;
    userId: string;
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
