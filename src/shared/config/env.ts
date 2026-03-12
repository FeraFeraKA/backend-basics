import { env } from "../../shared/config/env.schema.js";

export const config = {
  port: env.PORT,
  corsOrigin: env.CORS_ORIGIN,

  databaseUrl: env.DATABASE_URL,

  jwtAccessSecret: env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: env.JWT_REFRESH_SECRET,

  jwtAccessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
};
