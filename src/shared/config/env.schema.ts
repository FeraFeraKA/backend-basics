import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number(),
  CORS_ORIGIN: z.string(),

  DATABASE_URL: z.string(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),

  JWT_ACCESS_EXPIRES_IN: z.coerce.number(),
  JWT_REFRESH_EXPIRES_IN: z.coerce.number(),
});

export const env = envSchema.parse(process.env);
