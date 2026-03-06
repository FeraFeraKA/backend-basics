import type { Request, Response } from "express";
import { TaskService } from "./tasks.service.js";
import { createTaskSchema, updateTaskSchema } from "./tasks.schema.js";

export const TaskController = {
  async list(req: Request, res: Response) {
    const tasks = await TaskService.list();
    res.json(tasks);
  },

  async get(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const task = await TaskService.get(id);

    res.json(task);
  },

  async create(req: Request, res: Response) {
    const { title, text, status } = createTaskSchema.parse(req.body);

    const task = await TaskService.create({ title, text, status });

    res.status(201).json(task);
  },

  async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const parsed = updateTaskSchema.parse(req.body);

    const data = Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => value !== undefined),
    );

    const task = await TaskService.update(id, data);

    res.json(task);
  },

  async remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    await TaskService.remove(id);

    res.status(204).send();
  },
};
