import { Prisma, type Task, type User } from "@prisma/client";
import { UserStorage } from "./users.storage.js";
import { HttpError } from "../../shared/errors/httpError.js";
import type { CreateUserInput } from "./users.schema.js";

export const UserService = {
  list(): Promise<User[]> {
    return UserStorage.list();
  },

  async getTasks(id: string): Promise<Task[]> {
    const user = await UserStorage.findByIdWithTasks(id);

    if (!user) throw new HttpError(404, "NOT_FOUND", "User not found");

    return user.tasks;
  },

  async getUser(id: string): Promise<User> {
    const user = await UserStorage.findById(id);

    if (!user) throw new HttpError(404, "NOT_FOUND", "User not found");

    return user;
  },

  async create(data: CreateUserInput): Promise<User> {
    try {
      return await UserStorage.create(data);
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
