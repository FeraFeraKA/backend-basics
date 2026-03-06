import { HttpError } from "../errors/httpError.js";
import { z, ZodError } from "zod";
import type { Response, Request, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: err.message,
        details: z.treeifyError(err),
      },
    });
  }

  console.error(err);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal Server Error",
    },
  });
}

export function routeHandler(req: Request, res: Response, next: NextFunction) {
  next(new HttpError(404, "NOT_FOUND", "Route not found"));
}
