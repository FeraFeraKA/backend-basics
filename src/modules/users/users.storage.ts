import type { User } from "@prisma/client";
import { prisma } from "../../shared/db/prisma.js";
import type { CreateUserInput } from "./users.schema.js";

export const UserStorage = {
  async list(): Promise<User[]> {
    return prisma.user.findMany();
  },

  async findById(id: string) {
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
        email: data.email,
        name: data.name ?? null,
      },
    });
  },
};
