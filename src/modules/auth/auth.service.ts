import bcrypt from "bcrypt";
import { UserStorage } from "../users/users.storage.js";
import { Prisma } from "@prisma/client";
import { HttpError } from "../../shared/errors/httpError.js";
import { RefreshTokenStorage } from "../tokens/refreshToken.storage.js";
import { issueTokens } from "../tokens/issueTokens.js";
import { verifyRefreshToken } from "../../shared/lib/jwt.js";
import { toSafeUser } from "../../shared/mappers/user.mapper.js";
import { logger } from "../../shared/lib/logger.js";

const SALT_ROUNDS = 10;

export const AuthService = {
  async me(userId: string) {
    const user = await UserStorage.findById(userId);

    if (!user) throw new HttpError(401, "UNAUTHORIZED", "Unauthorized");

    const safeUser = toSafeUser(user);
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

      const safeUser = toSafeUser(user);

      logger.info({
        event: "register_success",
        userId: user.id,
        email: user.email,
      });

      return { accessToken, refreshToken, user: safeUser };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        logger.warn({
          event: "register_failed",
          reason: "EMAIL_TAKEN",
          email,
        });

        throw new HttpError(409, "EMAIL_TAKEN", "Email already taken");
      }
      throw error;
    }
  },

  async login(email: string, password: string) {
    const user = await UserStorage.findByEmail(email);

    if (!user) {
      logger.warn({
        event: "login_failed",
        reason: "INVALID_CREDENTIALS",
        email,
      });

      throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }

    const passwordHash = user.passwordHash;

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      logger.warn({
        event: "login_failed",
        reason: "INVALID_CREDENTIALS",
        email,
      });

      throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
    }

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

    logger.info({
      event: "login_success",
      userId: user.id,
      email: user.email,
    });

    return { accessToken, refreshToken, user: safeUser };
  },

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      logger.warn({
        event: "refresh_failed",
        reason: "NO_TOKEN",
      });

      throw new HttpError(401, "NO_TOKEN", "Invalid credentials");
    }

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      logger.warn({
        event: "refresh_failed",
        reason: "INVALID_TOKEN",
      });

      throw new HttpError(401, "INVALID_TOKEN", "Invalid token");
    }

    const refreshTokenDb = await RefreshTokenStorage.findByToken(refreshToken);

    if (!refreshTokenDb) {
      logger.warn({
        event: "refresh_failed",
        reason: "INVALID_TOKEN",
      });

      throw new HttpError(401, "INVALID_TOKEN", "Invalid token");
    }

    const user = await UserStorage.findById(payload.sub);

    if (!user) {
      logger.warn({
        event: "refresh_failed",
        reason: "INVALID_TOKEN",
        userId: refreshTokenDb.userId,
      });

      throw new HttpError(401, "INVALID_TOKEN", "Invalid token");
    }

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

    logger.info({
      event: "refresh_success",
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return { accessToken, refreshToken: newRefreshToken };
  },

  async logout(refreshToken: string) {
    if (!refreshToken) {
      logger.warn({
        event: "logout_failed",
        reason: "NO_TOKEN",
      });

      throw new HttpError(401, "NO_TOKEN", "Wrong token");
    }

    const refreshTokenDb = await RefreshTokenStorage.findByToken(refreshToken);

    if (!refreshTokenDb) {
      logger.warn({
        event: "logout_failed",
        reason: "INVALID_TOKEN",
      });

      throw new HttpError(401, "INVALID_TOKEN", "Invalid token");
    }

    await RefreshTokenStorage.deleteByToken(refreshToken);

    logger.info({
      event: "logout_success",
      userId: refreshTokenDb?.userId,
    });

    return { success: true };
  },
};
