import type { Request, Response } from "express";
import { UserService } from "./users.service.js";
import { createUserSchema } from "./users.schema.js";

export const UserController = {
  async list(req: Request, res: Response) {
    const users = await UserService.list();
    res.json(users);
  },

  async getTasks(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const tasks = await UserService.getTasks(id);

    res.json(tasks);
  },

  async getUser(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const user = await UserService.getUser(id);

    res.status(200).json(user);
  },

  async create(req: Request, res: Response) {
    const data = createUserSchema.parse(req.body);

    const user = await UserService.create(data);

    res.status(201).json(user);
  },
};
