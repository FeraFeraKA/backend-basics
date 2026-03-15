import express from "express";
import taskRouter from "./modules/tasks/tasks.routes.js";
import userRouter from "./modules/users/users.routes.js";
import {
  errorHandler,
  routeHandler,
} from "./shared/middleware/errorHandler.js";
import { requestLogger } from "./shared/middleware/requestLogger.js";
import authRouter from "./modules/auth/auth.routes.js";
import { config } from "./shared/config/env.js";
import cors from "cors";
import helmet from "helmet";
import { authLimiter } from "./shared/middleware/rateLimit.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./shared/config/swagger.js";

const app = express();

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(requestLogger);

app.use(helmet());

app.use(
  cors({
    origin: config.corsOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

app.use(express.json({ limit: "100kb" }));

app.use("/tasks", taskRouter);

app.use("/users", userRouter);

app.use("/auth", authLimiter, authRouter);

app.use(routeHandler);

app.use(errorHandler);

export default app;
