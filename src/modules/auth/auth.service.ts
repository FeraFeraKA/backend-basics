import bcrypt from "bcrypt";
import { UserStorage } from "../users/users.storage.js";
import { Prisma, type User } from "@prisma/client";
import { HttpError } from "../../shared/errors/httpError.js";
import { RefreshTokenStorage } from "../tokens/refreshToken.storage.js";
import { issueTokens } from "../tokens/issueTokens.js";
import { verifyRefreshToken } from "../../shared/lib/jwt.js";

const SALT_ROUNDS = 10;

function toSafeUser(user: User) {
  const { passwordHash, ...safeUser } = user;
  void passwordHash;
  return safeUser;
}

export const AuthService = {
  async me(userId: string) {
    const user = await UserStorage.findById(userId);

    if (!user) throw new HttpError(401, "UNAUTHORIZED", "Unauthorized");

    const { passwordHash: removed, ...safeUser } = user;
    void removed;
    return safeUser;
  },

  async register(email: string, password: string, name?: string) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const user = await UserStorage.create({ name, email, passwordHash });
      const { accessToken, refreshToken, refreshExpiresAt } = issueTokens({
        id: user.id,
        email: user.email,
      });

      await RefreshTokenStorage.create({
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshExpiresAt,
      });

      const { passwordHash: removed, ...safeUser } = user;
      void removed;
      return { accessToken, refreshToken, user: safeUser };
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

    if (!user)
      throw new HttpError(401, "INCORRECT_CREDENTIALS", "Wrong credentials");

    const passwordHash = user.passwordHash;

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid)
      throw new HttpError(401, "INCORRECT_CREDENTIALS", "Wrong credentials");

    const { accessToken, refreshToken, refreshExpiresAt } = issueTokens({
      id: user.id,
      email: user.email,
    });

    await RefreshTokenStorage.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: refreshExpiresAt,
    });

    const safeUser = toSafeUser(user);
    return { accessToken, refreshToken, user: safeUser };
  },

  async refresh(refreshToken: string) {
    if (!refreshToken)
      throw new HttpError(401, "INCORRECT_TOKEN", "Wrong token");

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) throw new HttpError(401, "INCORRECT_TOKEN", "Wrong token");

    const refreshTokenDb = await RefreshTokenStorage.findByToken(refreshToken);

    if (!refreshTokenDb)
      throw new HttpError(401, "INCORRECT_TOKEN", "Wrong token");

    const user = await UserStorage.findById(payload.sub);

    if (!user) throw new HttpError(401, "INCORRECT_TOKEN", "Wrong token");

    await RefreshTokenStorage.deleteByToken(refreshToken);

    const {
      accessToken,
      refreshToken: newRefreshToken,
      refreshExpiresAt,
    } = issueTokens({ id: payload.sub, email: payload.email });

    await RefreshTokenStorage.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: refreshExpiresAt,
    });

    return { accessToken, refreshToken: newRefreshToken };
  },
};
