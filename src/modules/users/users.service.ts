import { Prisma, type Task } from "@prisma/client";
import { UserStorage } from "./users.storage.js";
import { HttpError } from "../../shared/errors/httpError.js";
import type { CreateUserInput } from "./users.schema.js";
import { toSafeUser } from "../../shared/mappers/user.mapper.js";

export const UserService = {
  async list() {
    return (await UserStorage.list()).map((user) => toSafeUser(user));
  },

  async getTasks(id: string): Promise<Task[]> {
    const user = await UserStorage.findByIdWithTasks(id);

    if (!user) throw new HttpError(404, "NOT_FOUND", "User not found");

    return user.tasks;
  },

  async getUser(id: string) {
    const user = await UserStorage.findById(id);

    if (!user) throw new HttpError(404, "NOT_FOUND", "User not found");

    return toSafeUser(user);
  },

  async create(data: CreateUserInput) {
    try {
      return toSafeUser(await UserStorage.create(data));
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new HttpError(409, "EMAIL_TAKEN", "Email already taken");
      throw error;
    }
  },
};
