import z from "zod";

export const createUserSchema = z.object({
  email: z.email("Invalid Email").transform((email) => email.toLowerCase()),
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be shorter than 100 characters")
    .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
