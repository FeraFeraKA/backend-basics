import type { Request, Response } from "express";
import { TaskService } from "./tasks.service.js";
import { createTaskSchema, updateTaskSchema } from "./tasks.schema.js";

export const TaskController = {
  list(req: Request, res: Response) {
    const tasks = TaskService.list();
    res.json(tasks);
  },

  get(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const task = TaskService.get(id);

    res.json(task);
  },

  create(req: Request, res: Response) {
    const { title, text } = createTaskSchema.parse(req.body);

    const task = TaskService.create({ title, text });

    res.status(201).json(task);
  },

  update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const parsed = updateTaskSchema.parse(req.body);

    const data = Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => value !== undefined),
    );

    const task = TaskService.update(id, data);

    res.json(task);
  },

  remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    TaskService.remove(id);

    res.status(204).send();
  },
};
