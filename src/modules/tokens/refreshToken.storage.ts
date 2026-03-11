import { prisma } from "../../shared/db/prisma.js";

type CreateRefreshTokenInput = {
  userId: string;
  token: string;
  expiresAt: Date;
};

export const RefreshTokenStorage = {
  async create(data: CreateRefreshTokenInput) {
    return prisma.refreshToken.create({
      data,
    });
  },

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  },

  async deleteByToken(token: string) {
    return prisma.refreshToken.delete({
      where: { token },
    });
  },
};
