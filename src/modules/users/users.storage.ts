import type { User } from "@prisma/client";
import { prisma } from "../../shared/db/prisma.js";
import type { CreateUserInput } from "./users.schema.js";

export const UserStorage = {
  async list(): Promise<User[]> {
    return prisma.user.findMany();
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async findByIdWithTasks(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });
  },

  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({
      data: {
        name: data.name ?? null,
        email: data.email,
        passwordHash: data.passwordHash,
      },
    });
  },
};
