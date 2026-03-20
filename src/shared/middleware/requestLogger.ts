import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const status = res.statusCode;

    let level: "error" | "warn" | "info";

    if (status >= 500) level = "error";
    else if (status >= 400) level = "warn";
    else level = "info";

    logger[level]({
      method: req.method,
      url: req.originalUrl,
      status,
      duration: `${duration}ms`,
      userId: req.user?.id,
    });
  });

  next();
}
