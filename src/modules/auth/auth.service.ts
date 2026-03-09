import bcrypt from "bcrypt";
import { UserStorage } from "../users/users.storage.js";
import { Prisma } from "@prisma/client";
import { HttpError } from "../../shared/errors/httpError.js";

const SALT_ROUNDS = 10;

export const AuthService = {
  async register(email: string, password: string, name?: string) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const user = await UserStorage.create({ name, email, passwordHash });
      const { passwordHash: removed, ...safeUser } = user;
      void removed;
      return safeUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
        throw new HttpError(409, "EMAIL_TAKEN", "Email already taken");
      throw error;
    }
  },

  async login(email: string, password: string) {
    const user = await UserStorage.findByEmail(email);

    if (!user) throw new HttpError(401, "INCORRECT_CREDENTIALS", "Wrond credentials");

    const passwordHash = user.passwordHash;

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid)
      throw new HttpError(401, "INCORRECT_CREDENTIALS", "Wrond credentials");

    const { passwordHash: removed, ...safeUser } = user;
    void removed;
    return safeUser;
  },
};
