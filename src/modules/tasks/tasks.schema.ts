import z from "zod";
import { TASK_STATUSES } from "./tasks.types.js";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be shorter than 120 characters"),
  text: z.string().max(2000, "Text must be shorter than 2000 characters"),
  status: z.enum([...TASK_STATUSES]),
});

export const updateTaskSchema = createTaskSchema.partial();
