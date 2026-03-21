import z from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name too short")
    .max(50, "Name too long")
    .optional(),
  email: z
    .email("Invalid email")
    .trim()
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password too short"),
});

export const loginSchema = z.object({
  email: z
    .email("Invalid email")
    .trim()
    .transform((email) => email.toLowerCase()),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
