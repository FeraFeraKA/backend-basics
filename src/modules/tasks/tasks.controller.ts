import type { Request, Response } from "express";
import { TaskService } from "./tasks.service.js";
import {
  createTaskSchema,
  tasksListQuerySchema,
  updateTaskSchema,
} from "./tasks.schema.js";

export const TaskController = {
  async list(req: Request, res: Response) {
    const userId = req.user.id;
    const query = tasksListQuerySchema.parse(req.query);
    const tasks = await TaskService.list(userId, query);
    res.json(tasks);
  },

  async get(req: Request<{ id: string }>, res: Response) {
    const userId = req.user!.id;
    const { id } = req.params;

    const task = await TaskService.get(id, userId);

    res.json(task);
  },

  async create(req: Request, res: Response) {
    const userId = req.user!.id;
    const { title, text, status } = createTaskSchema.parse(req.body);

    const task = await TaskService.create({ title, text, status, userId });

    res.status(201).json(task);
  },

  async update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    const parsed = updateTaskSchema.parse(req.body);

    const data = Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => value !== undefined),
    );

    const task = await TaskService.update(id, userId, data);

    res.json(task);
  },

  async remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    const userId = req.user!.id;

    await TaskService.remove(id, userId);

    res.status(204).send();
  },
};
