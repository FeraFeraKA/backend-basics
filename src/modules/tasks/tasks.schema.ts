import z from "zod";
import { ORDER_OPTIONS, SORT_OPTIONS, TASK_STATUSES } from "./tasks.types.js";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be shorter than 120 characters"),
  text: z.string().max(2000, "Text must be shorter than 2000 characters"),
  status: z.enum([...TASK_STATUSES]),
});

export const updateTaskSchema = createTaskSchema.partial();

export const tasksListQuerySchema = z.object({
  page: z.coerce.number().min(1, "Count of pages is required").default(1),
  limit: z.coerce
    .number()
    .min(1, "Limit of tasks is required")
    .max(50, "Limit of tasks must be shorter than 50 tasks per 1 page")
    .default(10),
  status: z.enum([...TASK_STATUSES]).optional(),
  search: z.string().optional(),
  sort: z.enum([...SORT_OPTIONS]).default("createdAt"),
  order: z.enum([...ORDER_OPTIONS]).default("desc"),
});

export type TasksListQuery = z.infer<typeof tasksListQuerySchema>;
