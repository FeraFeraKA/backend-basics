import type { Request, Response } from "express";
import { TaskService } from "./tasks.service.js";

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
    const { title, text } = req.body;

    const task = TaskService.create({ title, text });

    res.status(201).json(task);
  },

  update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const task = TaskService.update(id, req.body);

    res.json(task);
  },

  remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const task = TaskService.remove(id);

    res.status(204).send();
  },
};
