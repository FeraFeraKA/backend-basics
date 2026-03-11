import { prisma } from "../../shared/db/prisma.js";

export const RefreshTokenStorage = {
  async create(data) {
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
