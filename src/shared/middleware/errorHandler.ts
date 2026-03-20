import { HttpError } from "../errors/httpError.js";
import { z, ZodError } from "zod";
import type { Response, Request, NextFunction } from "express";
import { logger } from "../lib/logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof HttpError) {
    logger.warn({
      message: err.message,
      code: err.code,
      method: req.method,
      url: req.originalUrl,
      userId: req.user?.id,
    });

    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  } else if (err instanceof ZodError) {
    logger.warn({
      message: err.message,
      code: "VALIDATION_ERROR",
      method: req.method,
      url: req.originalUrl,
      userId: req.user.id,
    });

    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: err.message,
        details: z.treeifyError(err),
      },
    });
  } else {
    logger.error({
      message: err.message,
      code: "INTERNAL_ERROR",
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      userId: req.user.id,
    });

    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal Server Error",
      },
    });
  }

  void next;
}

export function routeHandler(req: Request, res: Response, next: NextFunction) {
  next(new HttpError(404, "NOT_FOUND", "Route not found"));
}
