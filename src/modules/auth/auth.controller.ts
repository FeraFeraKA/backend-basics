import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";

export const AuthController = {
  async me(req: Request, res: Response) {
    const userId = req.user.id;

    const user = await AuthService.me(userId);

    res.json(user);
  },

  async register(req: Request, res: Response) {
    const { name, email, password } = registerSchema.parse(req.body);

    const user = await AuthService.register(email, password, name);

    res.status(201).json(user);
  },

  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);

    const user = await AuthService.login(email, password);

    res.status(200).json(user);
  },

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    const newRefreshToken = await AuthService.refresh(refreshToken);

    res.status(201).json(newRefreshToken);
  },
};
