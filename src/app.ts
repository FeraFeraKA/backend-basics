import express from "express";
import taskRouter from "./modules/tasks/tasks.routes.js";
import userRouter from "./modules/users/users.routes.js";
import {
  errorHandler,
  routeHandler,
} from "./shared/middleware/errorHandler.js";
import { requestLogger } from "./shared/middleware/requestLogger.js";
import authRouter from "./modules/auth/auth.routes.js";

const app = express();

app.use(requestLogger);

app.use(express.json());

app.use("/tasks", taskRouter);

app.use("/users", userRouter);

app.use("/auth", authRouter);

app.use(routeHandler);

app.use(errorHandler);

export default app;
