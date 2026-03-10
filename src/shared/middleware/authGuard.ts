import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/httpError.js";
import { verifyAccessToken } from "../lib/jwt.js";

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new HttpError(401, "UNAUTHORIZED", "Unauthorized");

  const token = authHeader.split(" ")[1];

  if (!token) throw new HttpError(401, "UNAUTHORIZED", "Unauthorized");

  let user;

  try {
    user = verifyAccessToken(token);
  } catch {
    throw new HttpError(401, "UNAUTHORIZED", "Unauthorized");
  }

  req.user = { id: user.sub, email: user.email };

  next();
}
