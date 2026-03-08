import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/httpError.js";

export function mockAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.header("x-user-id");

  if (!userId) throw new HttpError(401, "INVALID_USER", "There's no such user");

  req.user = { id: userId };

  next();
}
